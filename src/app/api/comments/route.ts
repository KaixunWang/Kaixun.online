import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("postId");

  if (!postId) {
    return NextResponse.json(
      { message: "Missing postId query parameter." },
      { status: 400 },
    );
  }

  const comments = await prisma.comment.findMany({
    where: {
      postId,
      status: "APPROVED",
    },
    orderBy: { createdAt: "asc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return NextResponse.json(comments);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json();
  const { postId, content } = body as {
    postId?: string;
    content?: string;
  };

  if (!postId || !content) {
    return NextResponse.json(
      { message: "postId and content are required." },
      { status: 400 },
    );
  }

  if (content.length > 2000) {
    return NextResponse.json(
      { message: "Comment is too long (max 2000 characters)." },
      { status: 400 },
    );
  }

  const postExists = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!postExists) {
    return NextResponse.json({ message: "Post not found." }, { status: 404 });
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      postId,
      userId,
      status: "PENDING",
    },
  });

  return NextResponse.json(comment, { status: 201, headers: { "Cache-Control": "no-store" } });
}

