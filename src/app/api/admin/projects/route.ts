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
  const projects = await prisma.project.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json();
  const { title, link, album, order, locationName, latitude, longitude } = body as {
    title?: string;
    link?: string;
    album?: string;
    order?: number;
    locationName?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  };

  if (!title || typeof title !== "string" || !title.trim()) {
    return NextResponse.json(
      { message: "title is required." },
      { status: 400 },
    );
  }

  const project = await prisma.project.create({
    data: {
      title: title.trim(),
      link: link && typeof link === "string" ? link.trim() || null : null,
      album: album && typeof album === "string" ? album.trim() || null : null,
      order: typeof order === "number" ? order : 0,
      locationName:
        typeof locationName === "string" && locationName.trim()
          ? locationName.trim()
          : null,
      latitude:
        typeof latitude === "number"
          ? latitude
          : latitude == null
            ? null
            : Number(latitude) || null,
      longitude:
        typeof longitude === "number"
          ? longitude
          : longitude == null
            ? null
            : Number(longitude) || null,
    },
  });

  return NextResponse.json(project, { status: 201 });
}
