import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const comments = await prisma.homeComment.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      user: {
        select: {
          id: true,
          displayId: true,
          name: true,
          email: true,
          image: true,
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
  const { content } = body as { content?: string };

  if (!content || typeof content !== "string") {
    return NextResponse.json(
      { message: "content is required." },
      { status: 400 },
    );
  }

  if (content.length > 2000) {
    return NextResponse.json(
      { message: "Comment is too long (max 2000 characters)." },
      { status: 400 },
    );
  }

  const comment = await prisma.homeComment.create({
    data: { content, userId },
    include: {
      user: {
        select: {
          id: true,
          displayId: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  return NextResponse.json(comment, {
    status: 201,
    headers: { "Cache-Control": "no-store" },
  });
}
