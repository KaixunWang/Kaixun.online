"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { HomeScrollContainer } from "../home/HomeScrollContainer";
import { HomeSection } from "../home/HomeSection";
import type { ProjectItem } from "../home/ProjectsSection";
import type { HomeCommentItem } from "../home/CommentsSection";

interface TechTerminalHomeProps {
  projects: ProjectItem[];
  comments: HomeCommentItem[];
  currentUserId: string | null;
}

const PROMPT = <span className="text-emerald-500">kaixun@online:~$</span>;

// --- HERO SECTION ---
function TerminalHero({ visibleRatio, onVisibilityChange }: { visibleRatio: number, onVisibilityChange?: (r: number) => void }) {
  const SENTENCE = "Hope you have a great day";
  const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
  
  const [phase, setPhase] = useState<"placeholder" | "typing" | "visible" | "deleting">("placeholder");
  const [displayText, setDisplayText] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const typingIndexRef = useRef(0);
  const deleteIndexRef = useRef(SENTENCE.length);
  const placeholderIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    onVisibilityChange?.(visibleRatio);
  }, [visibleRatio, onVisibilityChange]);

  useEffect(() => {
    if (phase === "placeholder") {
      placeholderIntervalRef.current = setInterval(() => {
        setPlaceholder(
          Array.from({ length: SENTENCE.length }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join(""),
        );
      }, 80);
      return () => {
        if (placeholderIntervalRef.current) clearInterval(placeholderIntervalRef.current);
      };
    }
    if (placeholderIntervalRef.current) {
      clearInterval(placeholderIntervalRef.current);
      placeholderIntervalRef.current = null;
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "typing") {
      if (typingIndexRef.current >= SENTENCE.length) {
        setPhase("visible");
        return;
      }
      const t = setTimeout(() => {
        setDisplayText(SENTENCE.slice(0, typingIndexRef.current + 1));
        typingIndexRef.current += 1;
      }, 80);
      return () => clearTimeout(t);
    }
  }, [phase, displayText]);

  useEffect(() => {
    if (phase === "deleting") {
      if (deleteIndexRef.current <= 0) {
        setDisplayText("");
        setPhase("placeholder");
        deleteIndexRef.current = SENTENCE.length;
        return;
      }
      const t = setTimeout(() => {
        deleteIndexRef.current -= 1;
        setDisplayText(SENTENCE.slice(0, deleteIndexRef.current));
      }, 50);
      return () => clearTimeout(t);
    }
  }, [phase, displayText]);

  useEffect(() => {
    if (visibleRatio >= 0.9 && phase === "placeholder") {
      setPhase("typing");
      typingIndexRef.current = 0;
    }
    if (visibleRatio < 0.5 && phase === "visible") {
      setPhase("deleting");
      deleteIndexRef.current = SENTENCE.length;
    }
  }, [visibleRatio, phase]);

  return (
    <div className="flex min-h-screen flex-col justify-center px-8 sm:px-16 font-mono text-zinc-300">
      <div className="mb-6 flex items-center gap-2 text-sm sm:text-base">
        {PROMPT} <span className="text-zinc-100">./greet.sh</span>
      </div>
      <h1 className="font-tech text-6xl font-bold tracking-[0.2em] text-emerald-400 sm:text-8xl md:text-9xl shadow-emerald-500/50 drop-shadow-md">
        KAIXUN
      </h1>
      <div className="mt-12 flex items-center gap-3">
        <span className="text-emerald-500 text-xl">&gt;</span>
        <span
          className="min-h-[1.5rem] text-lg text-zinc-300 sm:text-xl"
          style={{ minWidth: `${SENTENCE.length}ch` }}
        >
          {phase === "placeholder" ? <span className="text-zinc-600">{placeholder}</span> : displayText}
          {(phase === "typing" || phase === "deleting") && (
            <span className="animate-pulse bg-emerald-400 w-2 h-5 inline-block align-middle ml-1" />
          )}
        </span>
      </div>
    </div>
  );
}

// --- CARDS SECTION ---
function TerminalCards() {
  const cards = [
    { title: "Github", href: "https://github.com", desc: "Code repositories & contributions" },
    { title: "Bilibili", href: "https://bilibili.com", desc: "Video content & streaming" },
    { title: "Email", href: "mailto:hello@example.com", desc: "Direct communication" },
  ];

  return (
    <div className="flex min-h-screen flex-col justify-center px-8 sm:px-16 font-mono text-zinc-300">
      <div className="mb-8 flex items-center gap-2 text-sm sm:text-base">
        {PROMPT} <span className="text-zinc-100">cat social_links.json</span>
      </div>
      <div className="grid w-full max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
        {cards.map((card, i) => (
          <a
            key={card.title}
            href={card.href}
            target={card.href.startsWith("http") ? "_blank" : undefined}
            rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="group relative overflow-hidden border border-zinc-800 bg-[#0c0c0c] p-6 transition-all hover:border-emerald-500/50 hover:bg-[#111]"
          >
            <div className="absolute top-0 left-0 h-[2px] w-0 bg-emerald-500 transition-all duration-300 group-hover:w-full" />
            <div className="text-xs text-zinc-500 mb-2">{"{"}</div>
            <div className="pl-4">
              <div className="text-emerald-400 font-bold mb-1">"{card.title}"</div>
              <div className="text-xs text-zinc-400">"{card.desc}"</div>
            </div>
            <div className="text-xs text-zinc-500 mt-2">{"}"}{i < cards.length - 1 ? "," : ""}</div>
          </a>
        ))}
      </div>

      <div className="mt-16 w-full max-w-3xl">
        <div className="mb-4 flex items-center gap-2 text-sm sm:text-base">
          {PROMPT} <span className="text-zinc-100">cat self_intro.txt</span>
        </div>
        <div className="border-l-2 border-zinc-800 pl-4 py-2 text-zinc-400 text-sm leading-relaxed">
          <span className="animate-pulse">_</span>
          <br /><br />
          <span className="text-zinc-600">/* You can add your self introduction here... */</span>
        </div>
      </div>
    </div>
  );
}

// --- PROJECTS SECTION ---
function TerminalProjects({ projects }: { projects: ProjectItem[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(projects[0]?.id ?? null);

  return (
    <div className="flex min-h-screen flex-col justify-center px-8 sm:px-16 font-mono text-zinc-300">
      <div className="mb-8 flex items-center gap-2 text-sm sm:text-base">
        {PROMPT} <span className="text-zinc-100">ls -la ./projects/</span>
      </div>
      <div className="w-full max-w-4xl border border-zinc-800 bg-[#0c0c0c] overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="border-b border-zinc-800 text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-normal">PERMISSIONS</th>
              <th className="px-4 py-3 font-normal">OWNER</th>
              <th className="px-4 py-3 font-normal">ALBUM</th>
              <th className="px-4 py-3 font-normal">NAME</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-zinc-600">Total 0</td>
              </tr>
            ) : (
              projects.map((p) => {
                const isSelected = p.id === selectedId;
                return (
                  <tr
                    key={p.id}
                    onClick={() => setSelectedId(p.id)}
                    className={`cursor-pointer transition-colors border-b border-zinc-800/50 last:border-0 ${
                      isSelected ? "bg-emerald-950/20 text-emerald-300" : "text-zinc-400 hover:bg-zinc-900"
                    }`}
                  >
                    <td className="px-4 py-3 flex items-center gap-2">
                      <span className={isSelected ? "text-emerald-500" : "text-zinc-600"}>
                        {isSelected ? "drwxr-xr-x" : "-rw-r--r--"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-500">kaixun</td>
                    <td className="px-4 py-3">{p.album ?? "-"}</td>
                    <td className="px-4 py-3 font-medium flex items-center gap-2">
                      {isSelected && <span className="text-emerald-500">&gt;</span>}
                      {p.title}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- COMMENTS SECTION ---
function TerminalComments({ initialComments, currentUserId }: { initialComments: HomeCommentItem[], currentUserId: string | null }) {
  const [comments, setComments] = useState<HomeCommentItem[]>(initialComments);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [likingId, setLikingId] = useState<string | null>(null);

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
    if (!content.trim()) { setError("ERR: Empty input"); return; }
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
      setError("ERR: Network failure");
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

  return (
    <div className="flex min-h-screen flex-col justify-center px-8 sm:px-16 font-mono text-zinc-300 py-16">
      <div className="mb-6 flex items-center gap-2 text-sm sm:text-base">
        {PROMPT} <span className="text-zinc-100">tail -f /var/log/messages.log</span>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-3xl">
        <div className="flex flex-col gap-4 border border-zinc-800 bg-[#0c0c0c] p-4 max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700">
          {comments.length === 0 ? (
            <div className="text-zinc-600 text-sm">No logs found...</div>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex flex-col sm:flex-row gap-4 border-b border-zinc-800/50 pb-4 last:border-0 last:pb-0">
                <div className="flex items-start gap-3 w-48 shrink-0">
                  <div className="h-8 w-8 bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden shrink-0">
                    {c.user.image ? (
                      <Image src={c.user.image} alt="" width={32} height={32} className="object-cover" unoptimized={c.user.image.startsWith("http")} />
                    ) : (
                      <span className="text-zinc-500 text-xs">USR</span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-emerald-400 font-bold text-xs truncate w-32">@{displayName(c)}</span>
                    <span className="text-zinc-600 text-[10px]">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-between gap-2">
                  <div className="text-zinc-300 text-sm whitespace-pre-wrap">{c.content}</div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleLike(c.id)}
                      disabled={likingId !== null}
                      className="text-xs flex items-center gap-1 text-zinc-500 hover:text-emerald-400 transition-colors"
                    >
                      <span>[ACK]</span>
                      <span className={c.likeCount > 0 ? "text-emerald-500" : ""}>{c.likeCount}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit} className="border border-zinc-800 bg-[#0c0c0c] p-4 flex flex-col gap-3">
          <div className="flex items-start gap-2">
            <span className="text-emerald-500 mt-1">&gt;</span>
            <textarea
              className="flex-1 bg-transparent border-none outline-none text-sm text-zinc-300 placeholder-zinc-600 resize-none h-16"
              placeholder={currentUserId ? "Append to log..." : "Auth required to append log."}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={!currentUserId || loading}
            />
          </div>
          <div className="flex items-center justify-between border-t border-zinc-800 pt-3">
            <div className="text-red-400 text-xs">{error}</div>
            <button
              type="submit"
              disabled={!currentUserId || loading}
              className="text-xs bg-zinc-800 text-zinc-300 hover:bg-emerald-900 hover:text-emerald-400 px-4 py-1.5 transition-colors disabled:opacity-50"
            >
              {loading ? "EXECUTING..." : "EXECUTE"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


// --- MAIN LAYOUT ---
export function TechTerminalHome({ projects, comments, currentUserId }: TechTerminalHomeProps) {
  const [heroRatio, setHeroRatio] = useState(0);

  useEffect(() => {
    const container = document.querySelector("[data-home-scroll]");
    if (!container) return;

    const sections = container.querySelectorAll("[data-fullscreen-section]");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === sections[0]) {
            setHeroRatio(entry.intersectionRatio);
          }
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 0.9, 1] },
    );

    if (sections[0]) observer.observe(sections[0]);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#050505] font-mono text-sm text-zinc-300 selection:bg-emerald-500/30">
      <aside className="fixed left-0 top-0 z-10 flex w-16 sm:w-64 h-full shrink-0 flex-col border-r border-zinc-800 bg-[#0a0a0a]/90 backdrop-blur">
        <div className="p-4 sm:p-6 border-b border-zinc-800">
          <Link href="/" className="flex items-center gap-2 font-tech font-bold text-white hover:text-emerald-400 sm:text-lg">
            <span className="text-emerald-500">&gt;_</span>
            <span className="hidden sm:inline">KAIXUN</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2">
          <div className="hidden sm:block text-[10px] text-zinc-600 uppercase tracking-widest mb-4">Navigation</div>
          <Link href="/" className="flex items-center gap-3 rounded bg-emerald-950/30 px-3 py-2 text-emerald-400 border border-emerald-500/20">
            <span className="sm:hidden">~</span>
            <span className="hidden sm:inline">~/home</span>
          </Link>
          <Link href="/v/6" className="flex items-center gap-3 rounded px-3 py-2 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200">
            <span className="sm:hidden">P</span>
            <span className="hidden sm:inline">~/posts</span>
          </Link>
          <Link href="/profile" className="flex items-center gap-3 rounded px-3 py-2 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200">
            <span className="sm:hidden">U</span>
            <span className="hidden sm:inline">~/user_profile</span>
          </Link>
        </nav>
        <div className="p-4 sm:p-6 border-t border-zinc-800">
          <div className="hidden sm:block text-[10px] text-zinc-600 uppercase tracking-widest mb-3">Session</div>
          {currentUserId ? (
            <Link href="/api/auth/signout" className="flex items-center gap-2 text-zinc-400 hover:text-red-400 text-xs sm:text-sm">
              <span className="sm:hidden">X</span>
              <span className="hidden sm:inline">[ Terminate ]</span>
            </Link>
          ) : (
            <Link href="/auth/login" className="flex items-center gap-2 text-emerald-500 hover:text-emerald-300 text-xs sm:text-sm">
              <span className="sm:hidden">O</span>
              <span className="hidden sm:inline">[ Authenticate ]</span>
            </Link>
          )}
        </div>
      </aside>

      <div className="flex-1 pl-16 sm:pl-64 relative">
        {/* Subtle grid background */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
        
        <HomeScrollContainer>
          <div data-home-scroll className="contents relative z-10">
            <HomeSection>
              <TerminalHero visibleRatio={heroRatio} onVisibilityChange={setHeroRatio} />
            </HomeSection>
            <HomeSection>
              <TerminalCards />
            </HomeSection>
            <HomeSection>
              <TerminalProjects projects={projects} />
            </HomeSection>
            <HomeSection>
              <TerminalComments initialComments={comments} currentUserId={currentUserId} />
            </HomeSection>
          </div>
        </HomeScrollContainer>
      </div>
    </div>
  );
}
