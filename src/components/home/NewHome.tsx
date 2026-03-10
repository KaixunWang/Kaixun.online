"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { HomeScrollContainer } from "./HomeScrollContainer";
import { HomeSection } from "./HomeSection";
import { HeroSection } from "./HeroSection";
import { CardsSection } from "./CardsSection";
import { ProjectsSection, type ProjectItem } from "./ProjectsSection";
import {
  CommentsSection,
  type HomeCommentItem,
} from "./CommentsSection";

interface NewHomeProps {
  projects: ProjectItem[];
  comments: HomeCommentItem[];
  currentUserId: string | null;
}

export function NewHome({ projects, comments, currentUserId }: NewHomeProps) {
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
    <div className="flex min-h-screen bg-[#0a0a0a] font-mono text-sm text-zinc-300">
      <aside className="fixed left-0 top-0 z-10 flex w-48 shrink-0 flex-col border-r border-zinc-800 bg-zinc-950/90 p-4 backdrop-blur sm:w-56 sm:p-6">
        <Link
          href="/"
          className="border-b border-zinc-800 pb-3 text-base font-medium text-white hover:text-emerald-400"
        >
          kaixun.online
        </Link>
        <nav className="mt-6 space-y-0.5 text-sm">
          <Link
            href="/"
            className="block rounded px-3 py-2 text-emerald-400"
          >
            Home
          </Link>
          <Link
            href="/v/6"
            className="block rounded px-3 py-2 text-zinc-400 hover:bg-zinc-800/80 hover:text-white"
          >
            v6 (Posts)
          </Link>
          <Link
            href="/profile"
            className="block rounded px-3 py-2 text-zinc-400 hover:bg-zinc-800/80 hover:text-white"
          >
            Profile
          </Link>
        </nav>
        <div className="mt-6 border-t border-zinc-800 pt-4 text-xs text-zinc-500">
          {currentUserId ? (
            <Link href="/api/auth/signout" className="hover:text-zinc-300">
              Sign out
            </Link>
          ) : (
            <Link href="/auth/login" className="hover:text-emerald-400">
              Sign in
            </Link>
          )}
        </div>
      </aside>

      <div className="flex-1 pl-48 sm:pl-56">
        <HomeScrollContainer>
          <div data-home-scroll className="contents">
            <HomeSection>
              <HeroSection
                visibleRatio={heroRatio}
                onVisibilityChange={setHeroRatio}
              />
            </HomeSection>
            <HomeSection>
              <CardsSection />
            </HomeSection>
            <HomeSection>
              <ProjectsSection projects={projects} />
            </HomeSection>
            <HomeSection>
              <div className="mx-auto max-w-2xl">
                <CommentsSection
                  initialComments={comments}
                  currentUserId={currentUserId}
                />
              </div>
            </HomeSection>
          </div>
        </HomeScrollContainer>
      </div>
    </div>
  );
}
