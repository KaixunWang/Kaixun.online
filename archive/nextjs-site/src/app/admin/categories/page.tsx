"use client";

import { useEffect, useState } from "react";
import { Fragment } from "react";
import Link from "next/link";
import {
  buildCategoryTree,
  type PostCategoryRecord,
  type PostCategoryTreeNode,
} from "@/lib/post-categories";

function CategoryRows({
  nodes,
  depth = 0,
}: {
  nodes: PostCategoryTreeNode[];
  depth?: number;
}) {
  return (
    <>
      {nodes.map((node) => (
        <Fragment key={node.id}>
          <tr className="border-t border-zinc-100">
            <td className="px-4 py-2 text-zinc-500" style={{ paddingLeft: 16 + depth * 20 }}>
              {node.order}
            </td>
            <td className="px-4 py-2 text-zinc-900">{node.name}</td>
            <td className="px-4 py-2 text-zinc-500">{node.slug}</td>
            <td className="px-4 py-2 text-right text-xs">
              <Link
                href={`/admin/categories/${node.id}`}
                className="rounded-md px-2 py-1 font-medium text-zinc-700 hover:bg-zinc-100"
              >
                Edit
              </Link>
            </td>
          </tr>
          {node.children.length > 0 && (
            <CategoryRows nodes={node.children} depth={depth + 1} />
          )}
        </Fragment>
      ))}
    </>
  );
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<PostCategoryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((data) => setCategories(data))
      .finally(() => setLoading(false));
  }, []);

  const tree = buildCategoryTree(categories);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Categories
        </h1>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800"
        >
          New category
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs font-medium uppercase text-zinc-500">
            <tr>
              <th className="px-4 py-2">Order</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Slug</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-zinc-500">
                  Loading...
                </td>
              </tr>
            ) : tree.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-zinc-500">
                  No categories yet.
                </td>
              </tr>
            ) : (
              <CategoryRows nodes={tree} />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
