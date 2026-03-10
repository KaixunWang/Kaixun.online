import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Projects
        </h1>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800"
        >
          New project
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs font-medium uppercase text-zinc-500">
            <tr>
              <th className="px-4 py-2">Order</th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Link</th>
              <th className="px-4 py-2">Album</th>
              <th className="px-4 py-2">Location</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-sm text-zinc-500"
                >
                  No projects yet.
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project.id} className="border-t border-zinc-100">
                  <td className="px-4 py-2 text-zinc-600">{project.order}</td>
                  <td className="px-4 py-2 text-zinc-900">{project.title}</td>
                  <td className="px-4 py-2 text-zinc-500">
                    {project.link ? (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 hover:underline"
                      >
                        {project.link}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-2 text-zinc-500">
                    {project.album ?? "—"}
                  </td>
                  <td className="px-4 py-2 text-zinc-500">
                    {project.locationName
                      ? project.locationName
                      : project.latitude != null && project.longitude != null
                        ? `${project.latitude.toFixed(2)}, ${project.longitude.toFixed(2)}`
                        : "—"}
                  </td>
                  <td className="px-4 py-2 text-right text-xs">
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="rounded-md px-2 py-1 font-medium text-zinc-700 hover:bg-zinc-100"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
