"use client";

import Link from "next/link";

interface CinematicNavbarProps {
  currentUserId: string | null;
  /** 当前路径，用于高亮 nav 项 */
  currentPath?: string;
}

export function CinematicNavbar({ currentUserId, currentPath = "" }: CinematicNavbarProps) {
  const link = (href: string, label: string, active?: boolean) => (
    <Link
      href={href}
      className={`px-4 py-2 rounded-md transition-all ${
        active
          ? "text-emerald-400 bg-emerald-950/20 border border-emerald-500/20"
          : "text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200"
      }`}
    >
      {label}
    </Link>
  );

  const isHome = currentPath === "/" || currentPath === "";
  const isPosts = currentPath.startsWith("/posts");
  const isProjects = currentPath.startsWith("/projects");
  const isProfile = currentPath.startsWith("/profile");

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between border-b border-zinc-800/60 bg-[#020202]/80 backdrop-blur-md px-6 py-4">
      <div className="flex items-center gap-6">
        <Link
          href="/"
          className="flex items-center gap-3 font-tech font-bold text-white hover:text-emerald-400 text-lg transition-colors"
        >
          <div className="h-6 w-6 rounded bg-gradient-to-br from-emerald-400 to-emerald-900 flex items-center justify-center text-black text-xs">
            K
          </div>
          <span className="tracking-widest">KAIXUN</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-1 ml-8">
          {link("/", "~/home", isHome)}
          {link("/posts", "~/posts", isPosts)}
          {link("/projects", "~/projects", isProjects)}
          {link("/profile", "~/user_profile", isProfile)}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {currentUserId ? (
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-2 text-zinc-400 hover:text-red-400 text-sm transition-colors border border-zinc-800 rounded px-3 py-1.5 hover:border-red-900/50"
          >
            [ Terminate ]
          </Link>
        ) : (
          <Link
            href="/auth/login"
            className="flex items-center gap-2 text-emerald-500 hover:text-emerald-300 text-sm transition-colors border border-emerald-900/50 rounded px-3 py-1.5 hover:border-emerald-500/50"
          >
            [ Authenticate ]
          </Link>
        )}
      </div>
    </header>
  );
}
