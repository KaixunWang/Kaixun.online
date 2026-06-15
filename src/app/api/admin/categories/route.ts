import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;
  if (!session || role !== "ADMIN") return null;
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const categories = await prisma.postCategory.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json();
  const { name, slug, description, parentId, order } = body as {
    name?: string;
    slug?: string;
    description?: string;
    parentId?: string | null;
    order?: number;
  };

  if (!name?.trim() || !slug?.trim()) {
    return NextResponse.json(
      { message: "name and slug are required." },
      { status: 400 },
    );
  }

  if (parentId) {
    const parent = await prisma.postCategory.findUnique({
      where: { id: parentId },
    });
    if (!parent) {
      return NextResponse.json(
        { message: "Parent category not found." },
        { status: 400 },
      );
    }
  }

  try {
    const category = await prisma.postCategory.create({
      data: {
        name: name.trim(),
        slug: slug.trim(),
        description: description?.trim() || null,
        parentId: parentId || null,
        order: typeof order === "number" ? order : 0,
      },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message.includes("Unique constraint")
    ) {
      return NextResponse.json(
        { message: "Slug must be unique." },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { message: "Failed to create category." },
      { status: 500 },
    );
  }
}
