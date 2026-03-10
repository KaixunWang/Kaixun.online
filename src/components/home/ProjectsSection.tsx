"use client";

import { useState } from "react";

export interface ProjectItem {
  id: string;
  title: string;
  link: string | null;
  album: string | null;
  locationName: string | null;
  latitude: number | null;
  longitude: number | null;
  order: number;
}

export function ProjectsSection({ projects }: { projects: ProjectItem[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(
    projects[0]?.id ?? null,
  );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <h2
        className="mb-8 text-2xl font-semibold tracking-wide text-white font-tech"
      >
        Projects
      </h2>
      <div className="w-full max-w-xl overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/30">
        <div className="grid grid-cols-[auto_1fr_auto] gap-4 border-b border-zinc-800 bg-zinc-900/50 px-4 py-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
          <span className="w-6" />
          <span>Project</span>
          <span>Album</span>
        </div>
        {projects.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-zinc-500">
            No projects yet.
          </p>
        ) : (
          projects.map((p) => {
            const isSelected = p.id === selectedId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedId(p.id)}
                className={`grid w-full grid-cols-[auto_1fr_auto] gap-4 border-b border-zinc-800/80 px-4 py-3 text-left transition last:border-b-0 ${
                  isSelected
                    ? "bg-emerald-950/40 text-white"
                    : "bg-transparent text-zinc-500 hover:bg-zinc-800/30 hover:text-zinc-400"
                }`}
              >
                <span className="flex items-center">
                  <span
                    className={`h-4 w-4 rounded border ${
                      isSelected
                        ? "border-emerald-400 bg-emerald-500/30"
                        : "border-zinc-600 bg-transparent"
                    }`}
                  />
                </span>
                <span
                  className={`font-medium ${
                    isSelected ? "text-white underline decoration-emerald-400" : ""
                  }`}
                >
                  {p.title}
                </span>
                <span className="text-zinc-500">{p.album ?? "—"}</span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
