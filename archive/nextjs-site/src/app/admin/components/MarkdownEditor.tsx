"use client";

import { useRef } from "react";
import { MarkdownContent } from "@/app/posts/[slug]/MarkdownContent";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSlugSuggestion?: (slug: string) => void;
}

function slugFromFilename(filename: string): string {
  const base = filename.replace(/\.md$/i, "");
  return base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function MarkdownEditor({
  value,
  onChange,
  onSlugSuggestion,
}: MarkdownEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      onChange(text);
      if (onSlugSuggestion) {
        onSlugSuggestion(slugFromFilename(file.name));
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
        >
          Upload .md
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".md,text/markdown,text/plain"
          className="hidden"
          onChange={handleFileUpload}
        />
        <span className="text-xs text-zinc-500">
          Upload a Markdown file or edit below directly.
        </span>
      </div>

      <textarea
        className="min-h-[280px] w-full rounded-md border border-zinc-200 px-3 py-2 font-mono text-sm text-zinc-800 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="# Title&#10;&#10;Write Markdown here..."
        spellCheck={false}
      />

      {value.trim() && (
        <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
            Preview
          </p>
          <MarkdownContent content={value} variant="light" />
        </div>
      )}
    </div>
  );
}
