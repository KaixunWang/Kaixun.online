"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { RichTextEditor } from "@/app/admin/components/RichTextEditor";
import { MarkdownEditor } from "@/app/admin/components/MarkdownEditor";
import { CategorySelect } from "@/app/admin/components/CategorySelect";
import type { PostContentFormat } from "@/lib/post-content";

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  contentFormat: PostContentFormat;
  categoryId: string | null;
  published: boolean;
  contentRich: Record<string, unknown> | null;
}

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchPost() {
    try {
      const res = await fetch(`/api/admin/posts/${id}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "Failed to load post.");
        return;
      }
      setPost({
        ...(data as Post),
        contentFormat: data.contentFormat === "MARKDOWN" ? "MARKDOWN" : "RICH",
      });
    } catch {
      setError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!post) return;
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: post.title,
          slug: post.slug,
          contentFormat: post.contentFormat,
          content: post.content,
          contentRich:
            post.contentFormat === "MARKDOWN" ? null : post.contentRich,
          categoryId: post.categoryId,
          published: post.published,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "Failed to save post.");
        return;
      }
      router.push("/admin/posts");
    } catch {
      setError("Network error. Please try again later.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message ?? "Failed to delete post.");
        return;
      }
      router.push("/admin/posts");
    } catch {
      setError("Network error. Please try again later.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-zinc-500">Loading post...</p>;
  }

  if (!post) {
    return (
      <p className="text-sm text-red-600" role="alert">
        {error ?? "Post not found."}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Edit post
        </h1>
        <button
          type="button"
          onClick={handleDelete}
          disabled={saving}
          className="inline-flex items-center rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
        >
          Delete
        </button>
      </div>

      <form
        onSubmit={handleSave}
        className="space-y-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-zinc-200"
      >
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-700" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
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
            value={post.slug}
            onChange={(e) => setPost({ ...post, slug: e.target.value })}
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-700">Category</label>
          <CategorySelect
            value={post.categoryId ?? ""}
            onChange={(id) => setPost({ ...post, categoryId: id || null })}
          />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-medium text-zinc-700">Content format</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                setPost({ ...post, contentFormat: "RICH", contentRich: null })
              }
              className={`rounded-md px-3 py-1.5 text-xs font-medium ${
                post.contentFormat === "RICH"
                  ? "bg-zinc-900 text-white"
                  : "border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
              }`}
            >
              Rich text
            </button>
            <button
              type="button"
              onClick={() =>
                setPost({ ...post, contentFormat: "MARKDOWN", contentRich: null })
              }
              className={`rounded-md px-3 py-1.5 text-xs font-medium ${
                post.contentFormat === "MARKDOWN"
                  ? "bg-zinc-900 text-white"
                  : "border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
              }`}
            >
              Markdown
            </button>
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-700">Content</label>
          {post.contentFormat === "MARKDOWN" ? (
            <MarkdownEditor
              value={post.content}
              onChange={(value) => setPost({ ...post, content: value })}
            />
          ) : (
            <RichTextEditor
              key={`rich-${post.id}-${post.contentFormat}`}
              initialContentRich={post.contentRich}
              initialPlainText={post.content}
              onChange={({ contentRich, plainText }) =>
                setPost({ ...post, content: plainText, contentRich })
              }
            />
          )}
        </div>
        <label className="flex items-center gap-2 text-sm text-zinc-700">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-zinc-300 text-zinc-900"
            checked={post.published}
            onChange={(e) =>
              setPost({ ...post, published: e.target.checked })
            }
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
          disabled={saving}
          className="inline-flex items-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}
