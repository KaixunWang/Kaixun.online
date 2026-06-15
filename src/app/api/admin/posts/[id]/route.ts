import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import {
  normalizePostContentFormat,
  validatePostContent,
} from "@/lib/post-content";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;
  if (!session || role !== "ADMIN") {
    return null;
  }
  return session;
}

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  _request: Request,
  context: RouteContext,
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;

  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    return NextResponse.json({ message: "Post not found." }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json();
  const { title, slug, content, contentRich, contentFormat, categoryId, published } =
    body as {
      title?: string;
      slug?: string;
      content?: string;
      contentRich?: unknown;
      contentFormat?: string;
      categoryId?: string | null;
      published?: boolean;
    };

  const format = normalizePostContentFormat(contentFormat);

  if (!title || !slug || !content) {
    return NextResponse.json(
      { message: "title, slug and content are required." },
      { status: 400 },
    );
  }

  if (title.length > 200) {
    return NextResponse.json(
      { message: "Title is too long (max 200 characters)." },
      { status: 400 },
    );
  }

  if (slug.length > 200) {
    return NextResponse.json(
      { message: "Slug is too long (max 200 characters)." },
      { status: 400 },
    );
  }

  const contentError = validatePostContent(format, content);
  if (contentError) {
    return NextResponse.json({ message: contentError }, { status: 400 });
  }

  try {
    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        contentFormat: format,
        content,
        contentRich: format === "MARKDOWN" ? null : ((contentRich ?? null) as any),
        published: Boolean(published),
        categoryId: categoryId || null,
      },
    });

    return NextResponse.json(post);
  } catch (error: any) {
    if (
      typeof error?.message === "string" &&
      error.message.includes("Unique constraint")
    ) {
      return NextResponse.json(
        { message: "Slug must be unique. Please choose another one." },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { message: "Failed to update post." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext,
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;

  await prisma.post.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}

