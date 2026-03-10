"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CinematicChrome } from "./cinematic-shared";
import type { PostListItem } from "./types";

const PROMPT = (
  <span className="text-emerald-500 font-bold">kaixun@online:~$</span>
);
const PROMPT_STR = "kaixun@online:~$";

interface CinematicPostsProps {
  posts: PostListItem[];
  currentUserId: string | null;
}

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function CinematicPosts({ posts, currentUserId }: CinematicPostsProps) {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [outputLines, setOutputLines] = useState<
    { type: "in" | "out" | "err"; text: string }[]
  >([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [outputLines]);

  const runCommand = (raw: string) => {
    const line = raw.trim();
    if (!line) return;

    setOutputLines((prev) => [...prev, { type: "in", text: `${PROMPT_STR} ${line}` }]);

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
          const list = posts
            .map((p) => `${p.slug}  ${formatDate(p.createdAt)}`)
            .join("\n");
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
    <CinematicChrome
      currentUserId={currentUserId}
      currentPath="/posts"
      simplifiedBackground
      withNavOffset={true}
    >
      <div className="min-h-[calc(100vh-73px)] flex flex-col px-6 sm:px-12 py-10 font-mono">
        {/* Section 1: PROMPT + ls posts 风格命令行标题 + 文章列表 */}
        <div className="max-w-5xl w-full mx-auto flex flex-col flex-1">
          {/* 可交互终端：help / ls / cat / clear */}
          <div className="mb-4 flex items-center gap-2 text-sm sm:text-base">
            {PROMPT}{" "}
            <span className="text-zinc-400">type help for commands</span>
          </div>
          <div className="rounded-xl border border-zinc-800/60 bg-[#0a0a0a]/80 backdrop-blur-md overflow-hidden shadow-xl mb-8">
            {outputLines.length > 0 && (
              <div className="max-h-40 overflow-y-auto px-4 py-3 text-xs scrollbar-thin scrollbar-thumb-zinc-800">
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
              className="flex items-center gap-2 border-t border-zinc-800/60 px-4 py-3 cursor-text"
              onClick={() => inputRef.current?.focus()}
            >
              <span className="text-emerald-500 font-bold shrink-0">{PROMPT_STR}</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") runCommand(input);
                }}
                placeholder=" help | ls | cat <slug> | clear"
                className="min-w-0 flex-1 bg-transparent text-zinc-300 outline-none placeholder:text-zinc-600"
                spellCheck={false}
                autoComplete="off"
              />
              <span className="h-4 w-2 shrink-0 animate-pulse bg-emerald-500" />
            </div>
          </div>

          <div className="mb-6 flex items-center gap-2 text-sm sm:text-base">
            {PROMPT}{" "}
            <span className="text-zinc-100">ls -la posts/</span>
          </div>

          <div className="rounded-xl border border-zinc-800/60 bg-[#0a0a0a]/80 backdrop-blur-md overflow-hidden shadow-2xl flex-1 min-h-0">
            <div className="flex border-b border-zinc-800/60 bg-black/50 px-4 py-3 text-xs uppercase tracking-widest text-zinc-500">
              <div className="w-12">TYPE</div>
              <div className="flex-1 min-w-0">TITLE</div>
              <div className="w-28 shrink-0">DATE</div>
              <div className="w-16 text-right">LINK</div>
            </div>
            <div className="max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800">
              {posts.length === 0 ? (
                <div className="p-12 text-center text-zinc-600 border-b border-zinc-800/30 last:border-0">
                  No posts found. (published: 0)
                </div>
              ) : (
                posts.map((post, i) => (
                  <div
                    key={post.id}
                    className="flex items-center border-b border-zinc-800/30 px-4 py-4 last:border-0 hover:bg-zinc-900/50 transition-colors group"
                  >
                    <div className="w-12 flex justify-center">
                      <span className="text-zinc-600 text-xs">-rw-</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/posts/${post.slug}`}
                        className="font-medium text-zinc-300 group-hover:text-emerald-400 truncate block transition-colors"
                      >
                        {post.title}
                      </Link>
                      <span className="text-zinc-600 text-xs mt-0.5 block truncate">
                        posts/{post.slug}.md
                      </span>
                    </div>
                    <div className="w-28 shrink-0 text-zinc-500 text-xs tabular-nums">
                      {formatDate(post.createdAt)}
                    </div>
                    <div className="w-16 text-right">
                      <Link
                        href={`/posts/${post.slug}`}
                        className="text-xs text-zinc-500 hover:text-emerald-400 border border-zinc-700 hover:border-emerald-500/50 rounded px-2 py-1 transition-colors inline-block"
                      >
                        READ
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Section 2（可选）：底部提示 / 精选区 - 简洁版 */}
          {posts.length > 0 && (
            <div className="mt-10 flex items-center gap-2 text-sm text-zinc-500">
              {PROMPT}{" "}
              <span className="text-zinc-400">
                cat posts/{posts[0].slug}.md | head -n 1
              </span>
            </div>
          )}
        </div>
      </div>
    </CinematicChrome>
  );
}
