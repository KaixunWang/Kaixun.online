"use client";

import { ReactNode } from "react";

export function HomeSection({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      data-fullscreen-section
      className={`min-h-screen w-full shrink-0 snap-start snap-always ${className}`}
      style={{ scrollSnapAlign: "start", scrollSnapStop: "always" }}
    >
      {children}
    </section>
  );
}
