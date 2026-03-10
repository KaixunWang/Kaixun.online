"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { CinematicNavbar, CinematicBackground } from "./cinematic-shared";
import type { ProjectItem } from "../home/ProjectsSection";
import type { HomeCommentItem } from "../home/CommentsSection";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface CinematicHomeProps {
  projects: ProjectItem[];
  comments: HomeCommentItem[];
  currentUserId: string | null;
}

const PROMPT = <span className="text-emerald-500 font-bold">kaixun@online:~$</span>;
const SENTENCE = "Hope you have a great day";
const MATRIX_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

function randomMatrixChar() {
  return MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
}

function getPhase(ratio: number, start: number, end: number) {
  const p = (ratio - start) / (end - start);
  return Math.max(0, Math.min(1, p));
}

function CinematicHero({ ratio }: { ratio: number }) {
  const typeProgress = getPhase(ratio, 0.0, 0.5);
  const charsToShow = Math.floor(typeProgress * SENTENCE.length);
  const displayText = SENTENCE.slice(0, charsToShow);
  const [glitchChar, setGlitchChar] = useState("");
  const subtextOpacity = 1 - getPhase(ratio, 0.8, 1.0);
  const subtextTransformY = getPhase(ratio, 0.8, 1.0) * -50;
  const globalOpacity = 1 - getPhase(ratio, 0.9, 1.0);

  useEffect(() => {
    if (charsToShow >= SENTENCE.length) return;
    const id = setInterval(() => setGlitchChar(randomMatrixChar()), 80);
    return () => clearInterval(id);
  }, [charsToShow]);

  if (ratio >= 1.0) return null;

  return (
    <div 
      className="absolute inset-0 flex flex-col justify-center px-8 sm:px-16 font-mono text-zinc-300"
      style={{ opacity: globalOpacity }}
    >
      <div className="mb-6 flex items-center gap-2 text-sm sm:text-base">
        {PROMPT} <span className="text-zinc-100">./greet.sh</span>
      </div>
      
      <h1 className="font-tech text-6xl font-bold tracking-[0.2em] text-emerald-400 sm:text-8xl md:text-9xl relative">
        <span className="relative z-10 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">KAIXUN</span>
        <span className="absolute inset-0 z-0 text-emerald-500/30 blur-sm translate-x-[2px] translate-y-[2px]">KAIXUN</span>
        <span className="absolute inset-0 z-0 text-emerald-300/30 blur-[1px] -translate-x-[1px] -translate-y-[1px]">KAIXUN</span>
      </h1>

      <div 
        className="mt-12 flex items-center gap-3 transition-opacity duration-300"
        style={{ opacity: subtextOpacity, transform: `translateY(${subtextTransformY}px)` }}
      >
        <span className="text-emerald-500 text-xl">&gt;</span>
        <span
          className="min-h-[1.5rem] text-lg text-zinc-200 sm:text-2xl font-light tracking-wide font-mono"
          style={{ minWidth: `${SENTENCE.length + 1}ch` }}
        >
          {displayText}
          {charsToShow < SENTENCE.length && (
            <span className="text-emerald-400/90 animate-pulse tabular-nums">
              {glitchChar}
            </span>
          )}
          <span className={`inline-block align-middle ml-1 w-3 h-6 bg-emerald-400 ${typeProgress >= 1 ? "animate-pulse" : ""}`} />
        </span>
      </div>
    </div>
  );
}

function CinematicCards({ ratio }: { ratio: number }) {
  const fadeIn = getPhase(ratio, 1.0, 1.2);
  const fadeOut = getPhase(ratio, 1.8, 2.0);
  const opacity = fadeIn - fadeOut;
  const transformY = (1 - fadeIn) * 50 - fadeOut * 50;

  const cards = [
    { title: "Github", href: "https://github.com/KaixunWang/", icon: "🧑‍💻" },
    { title: "Bilibili", href: "https://space.bilibili.com/356340269", icon: "📺" },
    { title: "Email", href: "mailto:12310803@mail.sustech.edu.cn", icon: "📧" },
    { title: "QQ", href: "tencent://message/?uin=1114034186&Site=qq&Menu=yes", icon: "🐧" },
  ];

  if (ratio < 1.0 || ratio >= 2.0) return null;

  return (
    <div 
      className="absolute inset-0 flex flex-col justify-center px-8 sm:px-16 font-mono text-zinc-300"
      style={{ opacity, transform: `translateY(${transformY}px)` }}
    >
      <div className="mb-8 flex items-center gap-2 text-sm sm:text-base">
        {PROMPT} <span className="text-zinc-100">cat modules/social.ts</span>
      </div>
      
      <div className="grid w-full max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => (
          <a
            key={card.title}
            href={card.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col justify-between h-40 overflow-hidden rounded-xl border border-zinc-800/60 bg-gradient-to-br from-zinc-900/50 to-black p-6 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-emerald-500/50 hover:shadow-[0_10px_30px_-10px_rgba(16,185,129,0.2)]"
          >
            <div className="absolute -right-4 -top-4 text-7xl font-bold text-zinc-800/30 group-hover:text-emerald-900/20 transition-colors duration-500">
              {card.icon}
            </div>
            <div className="relative z-10 flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-zinc-600 group-hover:bg-emerald-400 group-hover:animate-pulse" />
              <div className="text-sm tracking-widest text-zinc-500 uppercase">{`Module 0${i + 1}`}</div>
            </div>
            <div className="relative z-10 font-tech text-2xl text-zinc-200 group-hover:text-emerald-300 transition-colors">
              {card.title}
            </div>
          </a>
        ))}
      </div>

      <div className="mt-16 w-full max-w-4xl">
        <div className="mb-4 flex items-center gap-2 text-sm sm:text-base">
          {PROMPT} <span className="text-zinc-100">cat self_intro.md</span>
        </div>
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/30 p-6 backdrop-blur-sm text-zinc-400 text-sm leading-relaxed">
          <span className="text-emerald-500/80"># Hello World</span>
          <br /><br />
          Hi! I'm Kaixun, a computer science student who enjoys building things with code. 
<br /><br />
I’m interested in systems, full-stack development, and experimenting with new ideas—whether that’s a small tool, a game prototype, or a weird side project that somehow works.
<br /><br />
This site is a little interactive terminal where you can explore my projects and see what I’ve been working on. Feel free to look around!
<br />
          <span className="animate-pulse">_</span>
        </div>
      </div>
    </div>
  );
}

function CinematicProjects({ ratio, projects }: { ratio: number, projects: ProjectItem[] }) {
  const fadeIn = getPhase(ratio, 2.0, 2.2);
  const fadeOut = getPhase(ratio, 2.8, 3.0);
  const opacity = fadeIn - fadeOut;
  const transformY = (1 - fadeIn) * 50 - fadeOut * 50;

  const [selectedId, setSelectedId] = useState<string | null>(projects[0]?.id ?? null);
  const projectsWithCoords = projects.filter(
    (p): p is ProjectItem & { latitude: number; longitude: number } =>
      p.latitude != null && p.longitude != null
  );
  const selectedProject = projects.find((p) => p.id === selectedId);

  if (ratio < 2.0 || ratio >= 3.0) return null;

  return (
    <div 
      className="absolute inset-0 flex flex-col justify-center px-8 sm:px-16 font-mono text-zinc-300"
      style={{ opacity, transform: `translateY(${transformY}px)` }}
    >
      <div className="mb-8 flex items-center gap-2 text-sm sm:text-base">
        {PROMPT} <span className="text-zinc-100">{`docker ps --format "table {{.Names}}\\t{{.Status}}"`}</span>
      </div>
      
      <div className="flex w-full max-w-6xl gap-6 flex-col lg:flex-row">
        {/* Left: Project list */}
        <div className="flex-1 min-w-0 rounded-xl border border-zinc-800/60 bg-[#0a0a0a]/80 backdrop-blur-md overflow-hidden shadow-2xl">
          <div className="flex border-b border-zinc-800/60 bg-black/50 px-4 py-3 text-xs uppercase tracking-widest text-zinc-500">
            <div className="w-16">STATUS</div>
            <div className="w-1/3">PROJECT_NAME</div>
            <div className="flex-1">ALBUM_REF</div>
            <div className="w-16 text-right">ACTION</div>
          </div>
          <div className="max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800">
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
                      <div className={`h-2 w-2 rounded-full ${isSelected ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-zinc-700'}`} />
                    </div>
                    <div className={`w-1/3 font-medium ${isSelected ? 'text-emerald-300' : 'text-zinc-400'}`}>
                      {p.title}
                    </div>
                    <div className="flex-1 text-zinc-500 text-sm">
                      {p.album ?? "null"}
                    </div>
                    <div className="w-16 text-right">
                      {p.link ? (
                        <a href={p.link} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="text-xs text-zinc-500 hover:text-emerald-400 border border-zinc-700 hover:border-emerald-500/50 rounded px-2 py-1 transition-colors">
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
              {/* 先画灰点，再画当前选中的绿点，保证绿点永远在最上层 */}
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
                      style={{ filter: "drop-shadow(0 0 6px rgba(16,185,129,0.8))" }}
                    />
                  </Marker>
                );
              })}
            </ComposableMap>
            {selectedProject && (selectedProject.locationName ?? selectedProject.latitude != null) && (
              <div className="absolute bottom-3 left-3 right-3 rounded-lg border border-zinc-700/60 bg-black/80 px-3 py-2 text-xs text-zinc-300 font-mono">
                <span className="text-emerald-500">$ </span>
                {selectedProject.locationName ?? `${selectedProject.latitude?.toFixed(2)}, ${selectedProject.longitude?.toFixed(2)}`}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CinematicComments({ ratio, initialComments, currentUserId }: { ratio: number; initialComments: HomeCommentItem[]; currentUserId: string | null }) {
  const [comments, setComments] = useState<HomeCommentItem[]>(initialComments);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [likingId, setLikingId] = useState<string | null>(null);

  const fadeIn = getPhase(ratio, 3.0, 3.2);
  const opacity = fadeIn;
  const transformY = (1 - fadeIn) * 50;

  async function fetchComments() {
    const res = await fetch("/api/home-comments");
    if (res.ok) {
      const data = await res.json();
      setComments(data);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUserId) { setError("ERR: Auth required"); return; }
    if (!content.trim()) { setError("ERR: Empty payload"); return; }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/home-comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(`ERR: ${data.message ?? "Failed"}`); return; }
      setContent("");
      await fetchComments();
    } catch {
      setError("ERR: Connection refused");
    } finally {
      setLoading(false);
    }
  }

  async function handleLike(commentId: string) {
    if (likingId) return;
    setLikingId(commentId);
    try {
      const res = await fetch(`/api/home-comments/${commentId}/like`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setComments(prev => prev.map(c => c.id === commentId ? { ...c, likeCount: data.likeCount } : c));
      }
    } finally {
      setLikingId(null);
    }
  }

  function displayName(c: HomeCommentItem) {
    return c.user.displayId || c.user.name || c.user.email.split("@")[0] || "anon";
  }

  if (ratio < 3.0) return null;

  return (
    <div 
      className="absolute inset-0 flex flex-col justify-center px-8 sm:px-16 font-mono text-zinc-300 pt-24 pb-8"
      style={{ opacity, transform: `translateY(${transformY}px)` }}
    >
      <div className="mb-6 flex items-center gap-2 text-sm sm:text-base">
        {PROMPT} <span className="text-zinc-100">tail -f /var/log/guestbook.log</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl flex-1 min-h-0">
        {/* Left: Input Form */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="rounded-xl border border-zinc-800/60 bg-[#0a0a0a]/80 backdrop-blur-md p-6 shadow-2xl">
            <h3 className="font-tech text-emerald-400 mb-6 text-lg tracking-widest">TRANSMIT_LOG</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <textarea
                className="w-full bg-black/50 border border-zinc-800 rounded-lg p-4 text-sm text-zinc-300 placeholder-zinc-700 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 resize-y min-h-[100px]"
                placeholder={currentUserId ? "Enter payload data..." : "Authentication required to transmit."}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={!currentUserId || loading}
              />
              <div className="flex items-center justify-between gap-2">
                <div className="text-red-400 text-xs truncate min-w-0">{error}</div>
                <button
                  type="submit"
                  disabled={!currentUserId || loading}
                  className="relative overflow-hidden rounded border border-emerald-900 bg-emerald-950/30 px-4 py-2 text-xs font-bold text-emerald-400 transition-all hover:bg-emerald-900/50 hover:text-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed group shrink-0"
                >
                  <span className="relative z-10">{loading ? "PROCESSING..." : "EXECUTE"}</span>
                  <div className="absolute inset-0 bg-emerald-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right: Comments List - scrollable */}
        <div className="flex-1 min-w-0 flex flex-col gap-4 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 pr-1">
          {comments.length === 0 ? (
            <div className="p-12 text-center text-zinc-600 rounded-xl border border-zinc-800/30 border-dashed">
              No transmission logs found.
            </div>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="group flex gap-4 rounded-xl border border-zinc-800/40 bg-zinc-900/20 p-5 transition-all hover:bg-zinc-900/40 hover:border-zinc-700/50 shrink-0">
                <div className="shrink-0">
                  <div className="relative h-12 w-12 overflow-hidden rounded bg-black border border-zinc-800 flex items-center justify-center">
                    {c.user.image ? (
                      <Image src={c.user.image} alt="" fill className="object-cover" unoptimized={c.user.image.startsWith("http")} />
                    ) : (
                      <span className="text-zinc-700 text-xs font-tech">USR</span>
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold text-sm truncate">@{displayName(c)}</span>
                      <span className="text-zinc-600 text-xs px-2 py-0.5 rounded-full bg-zinc-800/30 shrink-0">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {c.content}
                  </p>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => handleLike(c.id)}
                      disabled={likingId !== null}
                      className="flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-emerald-400 transition-colors"
                    >
                      <span className="tracking-widest">ACK</span>
                      <span className={`px-2 py-0.5 rounded bg-zinc-800/50 ${c.likeCount > 0 ? "text-emerald-400" : ""}`}>
                        {c.likeCount}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export function CinematicHome({ projects, comments, currentUserId }: CinematicHomeProps) {
  const [scrollTop, setScrollTop] = useState(0);
  const [vh, setVh] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    setVh(window.innerHeight);
    const handleResize = () => setVh(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const x = e.clientX;
    const y = e.clientY;
    setMousePos({ x, y });
    setTrail((prev) => [{ x, y }, ...prev].slice(0, 5));
  };

  const ratio = vh > 0 ? scrollTop / vh : 0;

  return (
    <div
      className="flex flex-col h-screen bg-[#050505] font-mono text-sm text-zinc-300 selection:bg-emerald-500/30 overflow-hidden relative"
      onMouseMove={handleMouseMove}
    >
      <CinematicBackground
        simplified={false}
        mousePos={mousePos}
        trail={trail}
      />
      <CinematicNavbar currentUserId={currentUserId} currentPath="/" />
      <div 
        className="flex-1 mt-[73px] relative overflow-y-auto scroll-smooth scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent"
        onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
      >
        <div style={{ height: "400vh" }} className="relative z-10">
          <div className="sticky top-0 h-[calc(100vh-73px)] overflow-hidden" id="projects">
            <CinematicHero ratio={ratio} />
            <CinematicCards ratio={ratio} />
            <CinematicProjects ratio={ratio} projects={projects} />
            <CinematicComments ratio={ratio} initialComments={comments} currentUserId={currentUserId} />
          </div>
        </div>
      </div>
    </div>
  );
}
