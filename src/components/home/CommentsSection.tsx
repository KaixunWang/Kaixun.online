"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export interface HomeCommentItem {
  id: string;
  content: string;
  likeCount: number;
  createdAt: string;
  user: {
    id: string;
    displayId: string | null;
    name: string | null;
    email: string;
    image: string | null;
  };
}

interface CommentsSectionProps {
  initialComments: HomeCommentItem[];
  currentUserId?: string | null;
}

export function CommentsSection({
  initialComments,
  currentUserId,
}: CommentsSectionProps) {
  const [comments, setComments] = useState<HomeCommentItem[]>(initialComments);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [likingId, setLikingId] = useState<string | null>(null);

  async function fetchComments() {
    const res = await fetch("/api/home-comments");
    if (res.ok) {
      const data = (await res.json()) as HomeCommentItem[];
      setComments(data);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUserId) {
      setError("Sign in to post a comment.");
      return;
    }
    if (!content.trim()) {
      setError("Comment cannot be empty.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/home-comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError((data as { message?: string }).message ?? "Failed to post.");
        return;
      }
      setContent("");
      await fetchComments();
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLike(commentId: string) {
    if (likingId) return;
    setLikingId(commentId);
    try {
      const res = await fetch(`/api/home-comments/${commentId}/like`, {
        method: "POST",
      });
      if (res.ok) {
        const data = (await res.json()) as { likeCount: number };
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId ? { ...c, likeCount: data.likeCount } : c,
          ),
        );
      }
    } finally {
      setLikingId(null);
    }
  }

  function displayName(c: HomeCommentItem) {
    return c.user.displayId || c.user.name || c.user.email || "Anonymous";
  }

  return (
    <div className="flex min-h-screen flex-col px-4 py-16">
      <h2
        className="mb-6 text-2xl font-semibold tracking-wide text-white font-tech"
      >
        Comments
      </h2>

      <form onSubmit={handleSubmit} className="mb-8">
        <textarea
          className="w-full max-w-xl rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none focus:border-emerald-600/50"
          placeholder={
            currentUserId
              ? "Share your thoughts..."
              : "Sign in to join the discussion."
          }
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={!currentUserId || loading}
          rows={3}
        />
        {error && (
          <p className="mt-2 text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={!currentUserId || loading}
          className="mt-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post comment"}
        </button>
      </form>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-zinc-500">No comments yet.</p>
        ) : (
          comments.map((c) => (
            <div
              key={c.id}
              className="flex gap-4 rounded-lg border border-zinc-800 bg-zinc-900/30 p-4"
            >
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-zinc-700">
                {c.user.image ? (
                  <Image
                    src={c.user.image}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized={c.user.image.startsWith("http")}
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-lg text-zinc-500">
                    &#x1F464;
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-zinc-300">
                  {displayName(c)}
                </p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-400">
                  {c.content}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleLike(c.id)}
                    disabled={likingId !== null}
                    className="flex items-center gap-1 rounded px-2 py-1 text-xs text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 disabled:opacity-50"
                    aria-label="Like"
                  >
                    <span aria-hidden>👍</span>
                    <span>{c.likeCount}</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
