"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  buildCategoryTree,
  flattenCategoryTree,
  type PostCategoryRecord,
} from "@/lib/post-categories";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [category, setCategory] = useState<PostCategoryRecord | null>(null);
  const [categories, setCategories] = useState<PostCategoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void Promise.all([
      fetch(`/api/admin/categories/${id}`).then((r) => r.json()),
      fetch("/api/admin/categories").then((r) => r.json()),
    ])
      .then(([cat, all]) => {
        setCategory(cat);
        setCategories(all);
      })
      .catch(() => setError("Failed to load category."))
      .finally(() => setLoading(false));
  }, [id]);

  const parentOptions = flattenCategoryTree(buildCategoryTree(categories)).filter(
    (opt) => opt.id !== id,
  );

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!category) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: category.name,
          slug: category.slug,
          description: category.description,
          parentId: category.parentId,
          order: category.order,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "Failed to save.");
        return;
      }
      router.push("/admin/categories");
    } catch {
      setError("Network error.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this category? Posts will become uncategorized.")) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "Failed to delete.");
        return;
      }
      router.push("/admin/categories");
    } catch {
      setError("Network error.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-zinc-500">Loading...</p>;
  if (!category) {
    return (
      <p className="text-sm text-red-600" role="alert">
        {error ?? "Category not found."}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Edit category
        </h1>
        <button
          type="button"
          onClick={handleDelete}
          disabled={saving}
          className="inline-flex items-center rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100"
        >
          Delete
        </button>
      </div>
      <form
        onSubmit={handleSave}
        className="space-y-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-zinc-200"
      >
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-700">Name</label>
          <input
            className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
            value={category.name}
            onChange={(e) => setCategory({ ...category, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-700">Slug</label>
          <input
            className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
            value={category.slug}
            onChange={(e) => setCategory({ ...category, slug: e.target.value })}
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-700">Parent</label>
          <select
            className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
            value={category.parentId ?? ""}
            onChange={(e) =>
              setCategory({
                ...category,
                parentId: e.target.value || null,
              })
            }
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
          <label className="text-xs font-medium text-zinc-700">Order</label>
          <input
            type="number"
            className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
            value={category.order}
            onChange={(e) =>
              setCategory({ ...category, order: Number(e.target.value) })
            }
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-700">Description</label>
          <textarea
            className="min-h-[80px] w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
            value={category.description ?? ""}
            onChange={(e) =>
              setCategory({ ...category, description: e.target.value || null })
            }
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
            disabled={saving}
            className="inline-flex items-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-70"
          >
            {saving ? "Saving..." : "Save changes"}
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
