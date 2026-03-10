"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RichTextEditor } from "@/app/admin/components/RichTextEditor";

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [contentRich, setContentRich] = useState<Record<string, unknown> | null>(
    null,
  );
  const [published, setPublished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, content, contentRich, published }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "Failed to create post.");
        return;
      }

      router.push("/admin/posts");
    } catch {
      setError("Network error. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
        New post
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-zinc-200">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-700" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-700" htmlFor="slug">
            Slug
          </label>
          <input
            id="slug"
            className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />
          <p className="text-xs text-zinc-500">
            Used in the URL, e.g. <code>/posts/{slug || "my-post"}</code>.
          </p>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-700">Content</label>
          <RichTextEditor
            initialContentRich={null}
            initialPlainText=""
            onChange={({ contentRich: rich, plainText }) => {
              setContentRich(rich);
              setContent(plainText);
            }}
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-zinc-700">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-zinc-300 text-zinc-900"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          Published
        </label>
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? "Creating..." : "Create post"}
        </button>
      </form>
    </div>
  );
}

