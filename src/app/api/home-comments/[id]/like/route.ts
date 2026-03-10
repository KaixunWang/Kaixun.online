import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { id: commentId } = await params;

  const existing = await prisma.homeCommentLike.findUnique({
    where: {
      commentId_userId: { commentId, userId },
    },
  });

  if (existing) {
    await prisma.homeCommentLike.delete({
      where: { id: existing.id },
    });
    const comment = await prisma.homeComment.update({
      where: { id: commentId },
      data: { likeCount: { decrement: 1 } },
    });
    return NextResponse.json({ likeCount: comment.likeCount });
  }

  const comment = await prisma.homeComment.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    return NextResponse.json({ message: "Comment not found." }, { status: 404 });
  }

  await prisma.homeCommentLike.create({
    data: { commentId, userId },
  });

  const updated = await prisma.homeComment.update({
    where: { id: commentId },
    data: { likeCount: { increment: 1 } },
  });

  return NextResponse.json({ likeCount: updated.likeCount });
}
