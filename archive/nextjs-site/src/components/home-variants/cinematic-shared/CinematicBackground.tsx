"use client";

import { useState, useEffect } from "react";

const MATRIX_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

interface CinematicBackgroundProps {
  /** 简化模式：仅 spotlight + 少量 glitch，无 trail/矩阵列 */
  simplified?: boolean;
  /** 由父组件传入的鼠标位置（父组件需 onMouseMove） */
  mousePos?: { x: number; y: number };
  /** 由父组件传入的 trail */
  trail?: { x: number; y: number }[];
}

export function CinematicBackground({
  simplified = false,
  mousePos = { x: 0, y: 0 },
  trail = [],
}: CinematicBackgroundProps) {
  const [glitchChars, setGlitchChars] = useState<
    { char: string; left: number; top: number; delay: number; duration: number }[]
  >([]);
  const [matrixCols, setMatrixCols] = useState<
    { delay: number; duration: number; text: string }[]
  >([]);

  useEffect(() => {
    const count = simplified ? 30 : 70;
    setGlitchChars(
      Array.from({ length: count }, () => ({
        char: MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)],
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 2 + Math.random() * 2,
      }))
    );
  }, [simplified]);

  useEffect(() => {
    if (simplified) return;
    setMatrixCols(
      Array.from({ length: 20 }, () => ({
        delay: -Math.random() * 10,
        duration: 5 + Math.random() * 10,
        text: Array.from({ length: 50 })
          .map(() => String.fromCharCode(33 + Math.floor(Math.random() * 94)))
          .join("\n"),
      }))
    );
  }, [simplified]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      {/* Mouse spotlight */}
      <div
        className="fixed inset-0 z-0 transition-all duration-100"
        style={{
          background: `radial-gradient(circle ${simplified ? 320 : 380}px at ${mousePos.x}px ${mousePos.y}px, rgba(16,185,129,0.14), transparent 68%)`,
        }}
      />
      {/* Trail (only when not simplified) */}
      {!simplified &&
        trail.slice(1).map((pos, i) => (
          <div
            key={i}
            className="fixed inset-0 z-0 transition-all duration-200"
            style={{
              background: `radial-gradient(circle ${340 - i * 50}px at ${pos.x}px ${pos.y}px, rgba(16,185,129,0.07), transparent 62%)`,
            }}
          />
        ))}
      {/* Random glitch chars */}
      {glitchChars.length > 0 && (
        <div className="fixed inset-0 z-0 overflow-hidden">
          {glitchChars.map((item, i) => (
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
      )}
      {/* Matrix rain columns (only when not simplified) */}
      {!simplified && matrixCols.length > 0 && (
        <div className="fixed inset-0 overflow-hidden opacity-[0.03] flex justify-around pointer-events-none">
          {matrixCols.map((col, i) => (
            <div
              key={i}
              className="text-emerald-500 font-tech text-xs whitespace-pre select-none animate-[slide_10s_linear_infinite]"
              style={{
                animationDelay: `${col.delay}s`,
                animationDuration: `${col.duration}s`,
              }}
            >
              {col.text}
            </div>
          ))}
        </div>
      )}
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_40%,transparent_100%)]" />
    </div>
  );
}
