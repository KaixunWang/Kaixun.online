import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ displayId: string }> },
) {
  const { displayId } = await params;

  if (!displayId) {
    return NextResponse.json(
      { message: "displayId is required." },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { displayId },
    select: {
      id: true,
      displayId: true,
      name: true,
      image: true,
      email: true,
    },
  });

  if (!user) {
    return NextResponse.json({ message: "User not found." }, { status: 404 });
  }

  return NextResponse.json(user);
}
