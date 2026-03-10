"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { CinematicChrome } from "./cinematic-shared";
import type { ProjectItem } from "../home/ProjectsSection";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const PROMPT = <span className="text-emerald-500 font-bold">kaixun@online:~$</span>;

interface ProjectsMapPageProps {
  projects: ProjectItem[];
  currentUserId: string | null;
}

export function ProjectsMapPage({ projects, currentUserId }: ProjectsMapPageProps) {
  const [selectedId, setSelectedId] = useState<string | null>(projects[0]?.id ?? null);

  const projectsWithCoords = projects.filter(
    (p): p is ProjectItem & { latitude: number; longitude: number } =>
      p.latitude != null && p.longitude != null,
  );
  const selectedProject = projects.find((p) => p.id === selectedId);

  return (
    <CinematicChrome
      currentUserId={currentUserId}
      currentPath="/projects"
      simplifiedBackground={false}
      withNavOffset
    >
      <div className="min-h-[calc(100vh-73px)] flex items-center justify-center px-8 sm:px-16 font-mono text-zinc-300">
        <div className="w-full max-w-6xl flex flex-col gap-6">
          <div className="mb-2 flex items-center gap-2 text-sm sm:text-base">
            {PROMPT}{" "}
            <span className="text-zinc-100">
              {`docker ps --format "table {{.Names}}\\t{{.Status}}"`}
            </span>
          </div>

          <div className="flex gap-6 flex-col lg:flex-row">
            {/* Left: Project list */}
            <div className="flex-1 min-w-0 rounded-xl border border-zinc-800/60 bg-[#0a0a0a]/80 backdrop-blur-md overflow-hidden shadow-2xl">
              <div className="flex border-b border-zinc-800/60 bg-black/50 px-4 py-3 text-xs uppercase tracking-widest text-zinc-500">
                <div className="w-16">STATUS</div>
                <div className="w-1/3">PROJECT_NAME</div>
                <div className="flex-1">ALBUM_REF</div>
                <div className="w-16 text-right">ACTION</div>
              </div>
              <div className="max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800">
                {projects.length === 0 ? (
                  <div className="p-8 text-center text-zinc-600">No active containers</div>
                ) : (
                  projects.map((p) => {
                    const isSelected = p.id === selectedId;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setSelectedId(p.id)}
                        className={`flex items-center border-b border-zinc-800/30 px-4 py-4 transition-all cursor-pointer last:border-0 hover:bg-zinc-900/50 ${
                          isSelected ? "bg-emerald-950/20" : ""
                        }`}
                      >
                        <div className="w-16 flex justify-center">
                          <div
                            className={`h-2 w-2 rounded-full ${
                              isSelected
                                ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                                : "bg-zinc-700"
                            }`}
                          />
                        </div>
                        <div
                          className={`w-1/3 font-medium ${
                            isSelected ? "text-emerald-300" : "text-zinc-400"
                          }`}
                        >
                          {p.title}
                        </div>
                        <div className="flex-1 text-zinc-500 text-sm">
                          {p.album ?? "null"}
                        </div>
                        <div className="w-16 text-right">
                          {p.link ? (
                            <a
                              href={p.link}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-xs text-zinc-500 hover:text-emerald-400 border border-zinc-700 hover:border-emerald-500/50 rounded px-2 py-1 transition-colors"
                            >
                              VISIT
                            </a>
                          ) : (
                            <span className="text-xs text-zinc-700">---</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right: World map */}
            <div className="w-full lg:w-[420px] shrink-0 rounded-xl border border-zinc-800/60 bg-[#0a0a0a]/80 backdrop-blur-md overflow-hidden shadow-2xl flex flex-col">
              <div className="border-b border-zinc-800/60 bg-black/50 px-4 py-3 text-xs uppercase tracking-widest text-zinc-500">
                LOCATION_MAP
              </div>
              <div className="relative flex-1 min-h-[280px] bg-zinc-950">
                <ComposableMap
                  projection="geoMercator"
                  projectionConfig={{ scale: 100 }}
                  className="w-full h-full"
                  style={{ width: "100%", height: "100%", minHeight: 280 }}
                >
                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies.map((geo) => (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill="#27272a"
                          stroke="#3f3f46"
                          style={{
                            default: { outline: "none" },
                            hover: { outline: "none", fill: "#3f3f46" },
                            pressed: { outline: "none" },
                          }}
                        />
                      ))
                    }
                  </Geographies>
                  {/* 先画灰点，再单独画当前选中的绿点，保证绿点永远在最上层 */}
                  {projectsWithCoords.map((p) => {
                    if (p.id === selectedId) return null;
                    return (
                      <Marker key={p.id} coordinates={[p.longitude, p.latitude]}>
                        <circle
                          r={5}
                          fill="#71717a"
                          stroke="#52525b"
                          strokeWidth={1}
                        />
                      </Marker>
                    );
                  })}
                  {projectsWithCoords.map((p) => {
                    if (p.id !== selectedId) return null;
                    return (
                      <Marker key={p.id} coordinates={[p.longitude, p.latitude]}>
                        <circle
                          r={8}
                          fill="#10b981"
                          stroke="#34d399"
                          strokeWidth={2}
                          style={{
                            filter: "drop-shadow(0 0 6px rgba(16,185,129,0.8))",
                          }}
                        />
                      </Marker>
                    );
                  })}
                </ComposableMap>
                {selectedProject &&
                  (selectedProject.locationName ?? selectedProject.latitude != null) && (
                    <div className="absolute bottom-3 left-3 right-3 rounded-lg border border-zinc-700/60 bg-black/80 px-3 py-2 text-xs text-zinc-300 font-mono">
                      <span className="text-emerald-500">$ </span>
                      {selectedProject.locationName ??
                        `${selectedProject.latitude?.toFixed(2)}, ${selectedProject.longitude?.toFixed(2)}`}
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CinematicChrome>
  );
}

