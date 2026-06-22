"use client";

import { useEffect, useState } from "react";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

interface CommentsSectionProps {
  postId: string;
  currentUserId?: string;
  /** 与 Cinematic/Terminal 深色风格一致 */
  variant?: "light" | "terminal";
}

export default function CommentsSection({
  postId,
  currentUserId,
  variant = "light",
}: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetchComments();
  }, [postId]);

  async function fetchComments() {
    try {
      const res = await fetch(`/api/comments?postId=${encodeURIComponent(postId)}`);
      if (!res.ok) return;
      const data = (await res.json()) as Comment[];
      setComments(data);
    } catch {
      // ignore for now
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUserId) {
      setError("You need to sign in to post a comment.");
      return;
    }
    if (!content.trim()) {
      setError("Comment cannot be empty.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, content }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "Failed to create comment.");
        return;
      }
      setContent("");
      await fetchComments();
    } catch {
      setError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      className={
        variant === "terminal"
          ? "border-t border-zinc-800/60 pt-8"
          : "border-t border-zinc-200 pt-8"
      }
    >
      <h2
        className={
          variant === "terminal"
            ? "mb-4 text-lg font-tech font-semibold tracking-widest text-emerald-400"
            : "mb-4 text-lg font-semibold text-zinc-900"
        }
      >
        {variant === "terminal" ? "TRANSMIT_LOG" : "Comments"}
      </h2>

      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        <textarea
          className={
            variant === "terminal"
              ? "min-h-[100px] w-full resize-y rounded-lg border border-zinc-800 bg-black/50 px-4 py-3 text-sm text-zinc-300 placeholder-zinc-600 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
              : "min-h-[80px] w-full resize-y rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
          }
          placeholder={
            currentUserId
              ? variant === "terminal"
                ? "Enter payload data..."
                : "Share your thoughts..."
              : variant === "terminal"
                ? "Authentication required to transmit."
                : "Sign in to join the discussion."
          }
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={!currentUserId || loading}
        />
        {error && (
          <p
            className={
              variant === "terminal"
                ? "text-sm text-red-400"
                : "text-sm text-red-600"
            }
            role="alert"
          >
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={!currentUserId || loading}
          className={
            variant === "terminal"
              ? "inline-flex items-center rounded border border-emerald-900 bg-emerald-950/30 px-4 py-2 text-xs font-bold text-emerald-400 transition-all hover:bg-emerald-900/50 disabled:cursor-not-allowed disabled:opacity-50"
              : "inline-flex items-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-70"
          }
        >
          {loading
            ? variant === "terminal"
              ? "PROCESSING..."
              : "Posting..."
            : variant === "terminal"
              ? "EXECUTE"
              : "Post comment"}
        </button>
      </form>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p
            className={
              variant === "terminal"
                ? "text-sm text-zinc-600"
                : "text-sm text-zinc-500"
            }
          >
            No comments yet.
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className={
                variant === "terminal"
                  ? "rounded-lg border border-zinc-800/60 bg-zinc-900/30 p-4 text-sm"
                  : "rounded-lg bg-zinc-50 p-3 text-sm"
              }
            >
              <div
                className={
                  variant === "terminal"
                    ? "mb-1 flex items-center justify-between text-xs text-zinc-500"
                    : "mb-1 flex items-center justify-between text-xs text-zinc-500"
                }
              >
                <span>{comment.user.name ?? comment.user.email}</span>
                <span>
                  {new Date(comment.createdAt).toLocaleString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p
                className={
                  variant === "terminal" ? "text-zinc-300" : "text-zinc-800"
                }
              >
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

