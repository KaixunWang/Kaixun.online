import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

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
  const { status } = body as { status?: "PENDING" | "APPROVED" | "REJECTED" };

  if (!status) {
    return NextResponse.json(
      { message: "status is required." },
      { status: 400 },
    );
  }

  const comment = await prisma.comment.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json(comment);
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

  await prisma.comment.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}

