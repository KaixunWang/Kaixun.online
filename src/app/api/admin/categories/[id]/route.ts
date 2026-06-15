import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { isDescendantCategory } from "@/lib/post-categories";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;
  if (!session || role !== "ADMIN") return null;
  return session;
}

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const category = await prisma.postCategory.findUnique({ where: { id } });
  if (!category) {
    return NextResponse.json({ message: "Category not found." }, { status: 404 });
  }
  return NextResponse.json(category);
}

export async function PATCH(request: Request, context: RouteContext) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json();
  const { name, slug, description, parentId, order } = body as {
    name?: string;
    slug?: string;
    description?: string | null;
    parentId?: string | null;
    order?: number;
  };

  if (!name?.trim() || !slug?.trim()) {
    return NextResponse.json(
      { message: "name and slug are required." },
      { status: 400 },
    );
  }

  const allCategories = await prisma.postCategory.findMany();
  const nextParentId = parentId ?? null;

  if (nextParentId === id) {
    return NextResponse.json(
      { message: "A category cannot be its own parent." },
      { status: 400 },
    );
  }

  if (nextParentId && isDescendantCategory(allCategories, id, nextParentId)) {
    return NextResponse.json(
      { message: "Cannot set parent to a descendant category." },
      { status: 400 },
    );
  }

  if (nextParentId) {
    const parent = await prisma.postCategory.findUnique({
      where: { id: nextParentId },
    });
    if (!parent) {
      return NextResponse.json(
        { message: "Parent category not found." },
        { status: 400 },
      );
    }
  }

  try {
    const category = await prisma.postCategory.update({
      where: { id },
      data: {
        name: name.trim(),
        slug: slug.trim(),
        description: description?.trim() || null,
        parentId: nextParentId,
        order: typeof order === "number" ? order : 0,
      },
    });
    return NextResponse.json(category);
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
      { message: "Failed to update category." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;

  const childCount = await prisma.postCategory.count({
    where: { parentId: id },
  });
  if (childCount > 0) {
    return NextResponse.json(
      { message: "Delete child categories first." },
      { status: 400 },
    );
  }

  await prisma.postCategory.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
