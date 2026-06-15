"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

interface MarkdownContentProps {
  content: string;
  variant?: "light" | "dark";
}

export function MarkdownContent({
  content,
  variant = "light",
}: MarkdownContentProps) {
  const baseClass =
    variant === "dark"
      ? "prose prose-sm sm:prose-base lg:prose-lg max-w-none prose-invert text-zinc-100 leading-relaxed"
      : "prose prose-sm sm:prose-base lg:prose-lg max-w-none text-zinc-800 leading-relaxed";

  return (
    <div className={baseClass}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
