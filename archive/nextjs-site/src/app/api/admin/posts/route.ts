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

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

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

  let authorId = (session.user as { id?: string })?.id ?? null;
  if (authorId) {
    const author = await prisma.user.findUnique({
      where: { id: authorId },
      select: { id: true },
    });
    if (!author) authorId = null;
  }

  try {
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        contentFormat: format,
        content,
        contentRich: format === "MARKDOWN" ? null : ((contentRich ?? null) as any),
        published: Boolean(published),
        authorId,
        categoryId: categoryId || null,
      },
    });

    return NextResponse.json(post, { status: 201 });
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
      { message: "Failed to create post." },
      { status: 500 },
    );
  }
}

