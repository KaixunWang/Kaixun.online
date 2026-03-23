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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) {
    return NextResponse.json({ message: "Project not found." }, { status: 404 });
  }
  return NextResponse.json(project);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json();
  const { title, link, album, order, locationName, latitude, longitude } = body as {
    title?: string;
    link?: string;
    album?: string;
    order?: number;
    locationName?: string | null;
    /** 表单/JSON 可能传数字或字符串 */
    latitude?: number | string | null;
    longitude?: number | string | null;
  };

  const data: {
    title?: string;
    link?: string | null;
    album?: string | null;
    order?: number;
    locationName?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  } = {};
  if (title !== undefined) data.title = String(title).trim();
  if (link !== undefined) data.link = link === "" || link == null ? null : String(link).trim();
  if (album !== undefined) data.album = album === "" || album == null ? null : String(album).trim();
  if (order !== undefined) data.order = Number(order) || 0;
  if (locationName !== undefined) {
    const value = typeof locationName === "string" ? locationName.trim() : "";
    data.locationName = value ? value : null;
  }
  if (latitude !== undefined) {
    if (latitude === null || latitude === "") {
      data.latitude = null;
    } else {
      const n = typeof latitude === "number" ? latitude : Number(latitude);
      data.latitude = Number.isNaN(n) ? null : n;
    }
  }
  if (longitude !== undefined) {
    if (longitude === null || longitude === "") {
      data.longitude = null;
    } else {
      const n = typeof longitude === "number" ? longitude : Number(longitude);
      data.longitude = Number.isNaN(n) ? null : n;
    }
  }

  const project = await prisma.project.update({
    where: { id },
    data,
  });
  return NextResponse.json(project);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }
  const { id } = await params;
  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
