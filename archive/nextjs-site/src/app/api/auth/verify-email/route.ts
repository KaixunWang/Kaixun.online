import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ message: "Missing token." }, { status: 400 });
  }

  const record = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!record || record.expires < new Date()) {
    return NextResponse.json({ message: "Invalid or expired token." }, { status: 400 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { email: record.identifier },
      data: { emailVerified: new Date() },
    });
    await tx.verificationToken.delete({
      where: { token },
    });
  });

  const loginUrl = new URL("/auth/login?verified=1", request.url);
  return NextResponse.redirect(loginUrl.toString());
}

