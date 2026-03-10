import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProjectsMapPage } from "@/components/home-variants/ProjectsMapPage";
import type { ProjectItem } from "@/components/home/ProjectsSection";

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions);
  const currentUserId = (session?.user as { id?: string } | undefined)?.id ?? null;

  const projectsRaw = await prisma.project.findMany({
    orderBy: { order: "asc" },
  });

  const projects: ProjectItem[] = projectsRaw.map((p) => ({
    id: p.id,
    title: p.title,
    link: p.link,
    album: p.album,
    locationName: p.locationName ?? null,
    latitude: p.latitude ?? null,
    longitude: p.longitude ?? null,
    order: p.order,
  }));

  return <ProjectsMapPage projects={projects} currentUserId={currentUserId} />;
}

