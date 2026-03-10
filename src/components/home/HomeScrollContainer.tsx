"use client";

import { useRef, useEffect, useCallback } from "react";

interface HomeScrollContainerProps {
  children: React.ReactNode;
}

export function HomeScrollContainer({ children }: HomeScrollContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const preventScrollIfNotFullyVisible = useCallback((e: WheelEvent) => {
    const el = containerRef.current;
    if (!el) return;

    const { scrollTop, scrollHeight, clientHeight } = el;
    const atBottom = scrollTop + clientHeight >= scrollHeight - 2;
    const atTop = scrollTop <= 2;

    if (e.deltaY > 0 && !atBottom) {
      const sections = el.querySelectorAll("[data-fullscreen-section]");
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i] as HTMLElement;
        const rect = section.getBoundingClientRect();
        const fullyVisible = rect.top >= -2 && rect.bottom <= clientHeight + 2;
        if (rect.top < 0 && rect.bottom > clientHeight && !fullyVisible) {
          e.preventDefault();
          return;
        }
      }
    }
    if (e.deltaY < 0 && !atTop) {
      const sections = el.querySelectorAll("[data-fullscreen-section]");
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i] as HTMLElement;
        const rect = section.getBoundingClientRect();
        const fullyVisible = rect.top >= -2 && rect.bottom <= clientHeight + 2;
        if (rect.top < 0 && rect.bottom > clientHeight && !fullyVisible) {
          e.preventDefault();
          return;
        }
      }
    }
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", preventScrollIfNotFullyVisible, { passive: false });
    return () => el.removeEventListener("wheel", preventScrollIfNotFullyVisible);
  }, [preventScrollIfNotFullyVisible]);

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth bg-[#0a0a0a]"
      style={{ scrollSnapType: "y mandatory" }}
    >
      {children}
    </div>
  );
}
