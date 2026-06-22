import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";
import crypto from "crypto";
import { hash } from "bcrypt";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body as {
      email?: string;
      password?: string;
      name?: string;
    };

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters." },
        { status: 400 },
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { message: "This email is already registered." },
        { status: 409 },
      );
    }

    const passwordHash = await hash(password, 10);

    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h

    await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          email,
          passwordHash,
          name,
        },
      });
      await tx.verificationToken.create({
        data: {
          identifier: email,
          token,
          expires,
        },
      });
    });

    const origin =
      request.headers.get("origin") ??
      new URL("/", process.env.NEXTAUTH_URL ?? "http://localhost:3000").origin;
    const verifyUrl = `${origin}/api/auth/verify-email?token=${encodeURIComponent(token)}`;

    try {
      await sendVerificationEmail({ to: email, verifyUrl });
    } catch (e) {
      console.error("Failed to send verification email", e);
      return NextResponse.json(
        { message: "Registration created, but failed to send verification email." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "Registration successful. Please check your email to verify your account." },
      { status: 201 },
    );
  } catch (error) {
    console.error("Register error", error);
    return NextResponse.json(
      { message: "Unexpected server error. Please try again later." },
      { status: 500 },
    );
  }
}

