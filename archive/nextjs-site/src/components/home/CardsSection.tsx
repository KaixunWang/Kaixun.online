"use client";

import Link from "next/link";

export interface CardItem {
  title: string;
  href: string;
}

const DEFAULT_CARDS: CardItem[] = [
  { title: "Github", href: "https://github.com" },
  { title: "Bilibili", href: "https://bilibili.com" },
  { title: "Email", href: "mailto:hello@example.com" },
];

export function CardsSection({ cards = DEFAULT_CARDS }: { cards?: CardItem[] }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <a
            key={card.title}
            href={card.href}
            target={card.href.startsWith("http") ? "_blank" : undefined}
            rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-6 py-8 text-center font-medium text-zinc-200 transition hover:border-emerald-600/50 hover:bg-zinc-800/50 hover:text-white"
          >
            {card.title}
          </a>
        ))}
      </div>
      <div className="mt-12 w-full max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-wider text-zinc-500">
          Self introduction
        </p>
        <div className="mt-2 border-b border-dashed border-zinc-700 pb-1 text-zinc-500">
          &nbsp;
        </div>
        <div className="mt-1 border-b border-dashed border-zinc-700 pb-1 text-zinc-500">
          &nbsp;
        </div>
      </div>
    </div>
  );
}
