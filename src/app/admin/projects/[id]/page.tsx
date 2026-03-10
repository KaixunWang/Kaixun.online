import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProjectEditForm } from "../ProjectEditForm";

export default async function AdminProjectEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
        Edit project
      </h1>
      <ProjectEditForm
        id={project.id}
        initialTitle={project.title}
        initialLink={project.link ?? ""}
        initialAlbum={project.album ?? ""}
        initialOrder={project.order}
        initialLocationName={project.locationName ?? ""}
        initialLatitude={project.latitude}
        initialLongitude={project.longitude}
      />
    </div>
  );
}
