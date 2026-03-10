"use client";

import { useState } from "react";
import { CinematicNavbar } from "./CinematicNavbar";
import { CinematicBackground } from "./CinematicBackground";

interface CinematicChromeProps {
  currentUserId: string | null;
  currentPath?: string;
  /** 简化背景（posts 等页面可用） */
  simplifiedBackground?: boolean;
  children: React.ReactNode;
  /** 主内容区是否预留顶部 navbar 高度 */
  withNavOffset?: boolean;
}

export function CinematicChrome({
  currentUserId,
  currentPath = "",
  simplifiedBackground = false,
  children,
  withNavOffset = true,
}: CinematicChromeProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState<{ x: number; y: number }[]>([]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const x = e.clientX;
    const y = e.clientY;
    setMousePos({ x, y });
    if (!simplifiedBackground) setTrail((prev) => [{ x, y }, ...prev].slice(0, 5));
  };

  return (
    <div
      className="flex flex-col min-h-screen bg-[#050505] font-mono text-sm text-zinc-300 selection:bg-emerald-500/30 overflow-hidden relative"
      onMouseMove={handleMouseMove}
    >
      <CinematicBackground
        simplified={simplifiedBackground}
        mousePos={mousePos}
        trail={trail}
      />
      <CinematicNavbar currentUserId={currentUserId} currentPath={currentPath} />
      <main
        className={`relative z-10 flex-1 ${withNavOffset ? "pt-[73px]" : ""}`}
      >
        {children}
      </main>
    </div>
  );
}
