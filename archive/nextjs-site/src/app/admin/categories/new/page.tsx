"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  buildCategoryTree,
  flattenCategoryTree,
  type PostCategoryRecord,
} from "@/lib/post-categories";

export default function NewCategoryPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState("");
  const [order, setOrder] = useState(0);
  const [categories, setCategories] = useState<PostCategoryRecord[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((data) => setCategories(data));
  }, []);

  const parentOptions = flattenCategoryTree(buildCategoryTree(categories));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          description: description || null,
          parentId: parentId || null,
          order: Number(order) || 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "Failed to create category.");
        return;
      }
      router.push("/admin/categories");
    } catch {
      setError("Network error.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
        New category
      </h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-zinc-200"
      >
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-700" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-700" htmlFor="parent">
            Parent
          </label>
          <select
            id="parent"
            className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
          >
            <option value="">(none — top level)</option>
            {parentOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {"—".repeat(opt.depth)} {opt.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-700" htmlFor="order">
            Order
          </label>
          <input
            id="order"
            type="number"
            className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-700" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            className="min-h-[80px] w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-70"
          >
            {submitting ? "Creating..." : "Create category"}
          </button>
          <Link
            href="/admin/categories"
            className="inline-flex items-center rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
