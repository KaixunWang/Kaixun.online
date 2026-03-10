"use client";

import { useState, useEffect, useRef } from "react";

const SENTENCE = "Hope you have a great day";
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

export function HeroSection({
  visibleRatio,
  onVisibilityChange,
}: {
  visibleRatio: number;
  onVisibilityChange?: (ratio: number) => void;
}) {
  const [phase, setPhase] = useState<"placeholder" | "typing" | "visible" | "deleting">("placeholder");
  const [displayText, setDisplayText] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const sectionRef = useRef<HTMLDivElement>(null);
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
          Array.from({ length: SENTENCE.length }, () => randomChar()).join(""),
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
    <div ref={sectionRef} className="flex min-h-screen flex-col items-center justify-center px-4">
      <h1
        className="font-tech text-5xl font-bold tracking-[0.3em] text-white sm:text-7xl md:text-8xl"
      >
        KAIXUN
      </h1>
      <div className="mt-8 flex items-center gap-2">
        <span className="h-6 w-6 shrink-0 rounded border border-zinc-600 bg-zinc-900/50" />
        <span
          className="min-h-[1.5rem] font-mono text-lg text-zinc-400 underline decoration-zinc-600 underline-offset-2 sm:text-xl"
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            minWidth: `${SENTENCE.length}ch`,
          }}
        >
          {phase === "placeholder" ? placeholder : displayText}
          {(phase === "typing" || phase === "deleting") && (
            <span className="animate-pulse">|</span>
          )}
        </span>
      </div>
    </div>
  );
}
