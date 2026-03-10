import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      displayId: true,
      image: true,
    },
  });

  if (!user) {
    return NextResponse.json({ message: "User not found." }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json();
  const { displayId, email, image } = body as {
    displayId?: string | null;
    email?: string;
    image?: string | null;
  };

  const data: { displayId?: string | null; email?: string; image?: string | null } = {};

  if (displayId !== undefined) {
    const trimmed = typeof displayId === "string" ? displayId.trim() : "";
    if (trimmed.length > 60) {
      return NextResponse.json(
        { message: "Display ID is too long (max 60 characters)." },
        { status: 400 },
      );
    }
    if (trimmed) {
      const existing = await prisma.user.findUnique({
        where: { displayId: trimmed },
      });
      if (existing && existing.id !== userId) {
        return NextResponse.json(
          { message: "This display ID is already taken." },
          { status: 400 },
        );
      }
    }
    data.displayId = trimmed || null;
  }

  if (email !== undefined) {
    const trimmed = typeof email === "string" ? email.trim() : "";
    if (!trimmed) {
      return NextResponse.json(
        { message: "Email is required." },
        { status: 400 },
      );
    }
    const existing = await prisma.user.findUnique({
      where: { email: trimmed },
    });
    if (existing && existing.id !== userId) {
      return NextResponse.json(
        { message: "This email is already in use." },
        { status: 400 },
      );
    }
    data.email = trimmed;
  }

  if (image !== undefined) {
    data.image = image === "" || image == null ? null : String(image);
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json(
      { message: "No valid fields to update." },
      { status: 400 },
    );
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      displayId: true,
      image: true,
    },
  });

  return NextResponse.json(user);
}
