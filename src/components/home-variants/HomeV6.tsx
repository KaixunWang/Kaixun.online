"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { PostListItem } from "./types";

interface HomeV6Props {
  posts: PostListItem[];
}

const PROMPT = "kaixun@online:~$";

export function HomeV6({ posts }: HomeV6Props) {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [outputLines, setOutputLines] = useState<{ type: "in" | "out" | "err"; text: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [outputLines]);

  const runCommand = (raw: string) => {
    const line = raw.trim();
    if (!line) return;

    setOutputLines((prev) => [...prev, { type: "in", text: `${PROMPT} ${line}` }]);

    const [cmd, ...args] = line.split(/\s+/);
    const arg = args.join(" ").trim();

    switch (cmd?.toLowerCase()) {
      case "help": {
        setOutputLines((prev) => [
          ...prev,
          {
            type: "out",
            text: "ls              list posts\ncat <slug>      open post\nclear           clear output\nhelp            show this",
          },
        ]);
        break;
      }
      case "ls": {
        if (posts.length === 0) {
          setOutputLines((prev) => [...prev, { type: "out", text: "(no posts yet)" }]);
        } else {
          const list = posts.map((p) => `${p.slug}  ${p.createdAt.toLocaleDateString()}`).join("\n");
          setOutputLines((prev) => [...prev, { type: "out", text: list }]);
        }
        break;
      }
      case "cat": {
        if (!arg) {
          setOutputLines((prev) => [...prev, { type: "err", text: "Usage: cat <slug>" }]);
          break;
        }
        const post = posts.find((p) => p.slug === arg);
        if (post) {
          router.push(`/posts/${post.slug}`);
        } else {
          setOutputLines((prev) => [
            ...prev,
            { type: "err", text: `No such post: ${arg}. Use 'ls' to list.` },
          ]);
        }
        break;
      }
      case "clear": {
        setOutputLines([]);
        break;
      }
      default: {
        setOutputLines((prev) => [
          ...prev,
          { type: "err", text: `Unknown command: ${cmd}. Type 'help' for commands.` },
        ]);
      }
    }
    setInput("");
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] font-mono text-sm text-zinc-300">
      {/* Left sidebar — normal UI + About */}
      <aside className="w-56 shrink-0 border-r border-zinc-800 bg-zinc-950/50 p-6">
        <Link
          href="/"
          className="block border-b border-zinc-800 pb-3 text-base font-medium text-white hover:text-emerald-400"
        >
          kaixun.online
        </Link>
        <nav className="mt-6 space-y-0.5 text-sm">
          <Link
            href="/"
            className="block rounded px-3 py-2 text-zinc-400 hover:bg-zinc-800/80 hover:text-white"
          >
            Home
          </Link>
          <span className="block rounded px-3 py-2 bg-zinc-800/50 text-emerald-400">
            Posts
          </span>
        </nav>

        {/* 自我介绍 / About */}
        <section className="mt-10 border-t border-zinc-800 pt-6">
          <h2 className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            About
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-zinc-400">
            Write a short intro here. You can add links below.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-emerald-400 hover:underline"
            >
              GitHub
            </a>
            <a
              href="mailto:hello@example.com"
              className="text-xs text-emerald-400 hover:underline"
            >
              Email
            </a>
            <Link href="/" className="text-xs text-emerald-400 hover:underline">
              Blog
            </Link>
          </div>
        </section>

        <div className="mt-8 flex items-center gap-1 text-zinc-600">
          <span className="h-3 w-1.5 animate-pulse bg-emerald-500" />
          <span>_</span>
        </div>
      </aside>

      {/* Right main — normal table + command input */}
      <main className="flex min-w-0 flex-1 flex-col p-8">
        <h1 className="mb-4 text-lg font-medium text-white">Posts</h1>
        {posts.length === 0 ? (
          <p className="rounded border border-zinc-800 bg-zinc-900/30 px-4 py-6 text-zinc-500">
            No posts yet.
          </p>
        ) : (
          <div className="overflow-hidden rounded border border-zinc-800">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/50">
                  <th className="px-4 py-3 font-medium text-zinc-400">Title</th>
                  <th className="px-4 py-3 font-medium text-zinc-400">Date</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr
                    key={post.id}
                    className="border-b border-zinc-800/80 transition hover:bg-zinc-800/50"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/posts/${post.slug}`}
                        className="text-emerald-400 underline-offset-2 hover:underline hover:text-emerald-300"
                      >
                        {post.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-zinc-600">
                      {post.createdAt.toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Terminal command input + output */}
        <div className="mt-8 flex flex-1 flex-col rounded border border-zinc-800 bg-zinc-900/30">
          {outputLines.length > 0 && (
            <div className="max-h-48 overflow-y-auto px-4 py-3 text-xs">
              {outputLines.map((line, i) => (
                <div
                  key={i}
                  className={
                    line.type === "in"
                      ? "text-zinc-500"
                      : line.type === "err"
                        ? "text-red-400/90"
                        : "text-zinc-400 whitespace-pre-wrap"
                  }
                >
                  {line.text}
                </div>
              ))}
              <div ref={outputEndRef} />
            </div>
          )}
          <div
            className="flex items-center gap-2 border-t border-zinc-800 px-4 py-2"
            onClick={() => inputRef.current?.focus()}
          >
            <span className="text-zinc-500">{PROMPT}</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") runCommand(input);
              }}
              placeholder=" type command (help for list)"
              className="min-w-0 flex-1 bg-transparent text-zinc-300 outline-none placeholder:text-zinc-600"
              spellCheck={false}
              autoComplete="off"
            />
            <span className="h-4 w-2 animate-pulse bg-emerald-500" />
          </div>
        </div>

        <nav className="mt-6 flex flex-wrap gap-4 border-t border-zinc-800 pt-4 text-xs text-zinc-500">
          <Link href="/" className="hover:text-zinc-300">Home</Link>
          <Link href="/v/1" className="hover:text-emerald-400/80">v1</Link>
          <Link href="/v/2" className="hover:text-emerald-400/80">v2</Link>
          <Link href="/v/3" className="hover:text-emerald-400/80">v3</Link>
          <Link href="/v/4" className="hover:text-emerald-400/80">v4</Link>
          <Link href="/v/5" className="hover:text-emerald-400/80">v5</Link>
          <span className="text-zinc-600">v6</span>
        </nav>
      </main>
    </div>
  );
}
