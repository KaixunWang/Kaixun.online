"use client";

import { useState } from "react";
import Link from "next/link";
import { Session } from "next-auth";

const MATRIX_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

function RandomGlitchBackground() {
  const [chars] = useState(() =>
    Array.from({ length: 70 }, () => ({
      char: MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)],
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 2,
    }))
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {chars.map((item, i) => (
        <span
          key={i}
          className="absolute text-emerald-500/20 font-mono text-xs select-none animate-[glitch-flicker_ease-in-out_infinite]"
          style={{
            left: `${item.left}%`,
            top: `${item.top}%`,
            animationDelay: `${item.delay}s`,
            animationDuration: `${item.duration}s`,
          }}
        >
          {item.char}
        </span>
      ))}
    </div>
  );
}

export function ProfileLayout({
  session,
  children,
}: {
  session: Session | null;
  children: React.ReactNode;
}) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState<{ x: number; y: number }[]>([]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const x = e.clientX;
    const y = e.clientY;
    setMousePos({ x, y });
    setTrail((prev) => [{ x, y }, ...prev].slice(0, 5));
  };

  return (
    <div
      className="min-h-screen bg-[#050505] font-mono text-sm text-zinc-300 selection:bg-emerald-500/30"
      onMouseMove={handleMouseMove}
    >
      {/* Mouse spotlight */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-all duration-100"
        style={{
          background: `radial-gradient(circle 380px at ${mousePos.x}px ${mousePos.y}px, rgba(16,185,129,0.14), transparent 68%)`,
        }}
      />
      {trail.slice(1).map((pos, i) => (
        <div
          key={i}
          className="pointer-events-none fixed inset-0 z-0 transition-all duration-200"
          style={{
            background: `radial-gradient(circle ${340 - i * 50}px at ${pos.x}px ${pos.y}px, rgba(16,185,129,0.07), transparent 62%)`,
          }}
        />
      ))}
      <RandomGlitchBackground />

      {/* Grid overlay - same as CinematicHome */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_20%,transparent_100%)] opacity-30" />

      {/* Top Navbar - same as CinematicHome */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between border-b border-zinc-800/60 bg-[#020202]/80 backdrop-blur-md px-6 py-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 font-tech font-bold text-white hover:text-emerald-400 text-lg transition-colors">
            <div className="h-6 w-6 rounded bg-gradient-to-br from-emerald-400 to-emerald-900 flex items-center justify-center text-black text-xs">K</div>
            <span className="tracking-widest">KAIXUN</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-1 ml-8">
            <Link href="/" className="px-4 py-2 text-zinc-400 rounded-md hover:bg-zinc-900/50 hover:text-zinc-200 transition-all">
              ~/home
            </Link>
            <Link href="/posts" className="px-4 py-2 text-zinc-400 rounded-md hover:bg-zinc-900/50 hover:text-zinc-200 transition-all">
              ~/posts
            </Link>
            <Link href="/projects" className="px-4 py-2 text-zinc-400 rounded-md hover:bg-zinc-900/50 hover:text-zinc-200 transition-all">
              ~/projects
            </Link>
            <Link href="/profile" className="px-4 py-2 text-emerald-400 bg-emerald-950/20 rounded-md border border-emerald-500/20 transition-all hover:bg-emerald-900/30">
              ~/user_profile
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {session ? (
            <Link href="/api/auth/signout" className="flex items-center gap-2 text-zinc-400 hover:text-red-400 text-sm transition-colors border border-zinc-800 rounded px-3 py-1.5 hover:border-red-900/50">
              [ Terminate ]
            </Link>
          ) : (
            <Link href="/auth/login" className="flex items-center gap-2 text-emerald-500 hover:text-emerald-300 text-sm transition-colors border border-emerald-900/50 rounded px-3 py-1.5 hover:border-emerald-500/50">
              [ Authenticate ]
            </Link>
          )}
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-2xl px-4 pt-32 pb-10">
        {children}
      </main>
    </div>
  );
}
