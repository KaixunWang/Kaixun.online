"use client";

import Link from "next/link";
import {
  buildCategoryTree,
  type PostCategoryRecord,
  type PostCategoryTreeNode,
} from "@/lib/post-categories";

interface PostDetailSidebarProps {
  categories: PostCategoryRecord[];
  currentCategoryId: string | null;
  siblingPosts: Array<{ id: string; title: string; slug: string }>;
  currentSlug: string;
}

function CategoryLinks({
  nodes,
  depth,
  currentCategoryId,
}: {
  nodes: PostCategoryTreeNode[];
  depth: number;
  currentCategoryId: string | null;
}) {
  return (
    <ul className="space-y-1">
      {nodes.map((node) => (
        <li key={node.id}>
          <Link
            href={`/posts?category=${node.slug}`}
            className={`block rounded-md px-2 py-1.5 text-sm transition-colors ${
              currentCategoryId === node.id
                ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/30"
                : "text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200"
            }`}
            style={{ paddingLeft: 8 + depth * 12 }}
          >
            {node.name}
          </Link>
          {node.children.length > 0 && (
            <CategoryLinks
              nodes={node.children}
              depth={depth + 1}
              currentCategoryId={currentCategoryId}
            />
          )}
        </li>
      ))}
    </ul>
  );
}

export function PostDetailSidebar({
  categories,
  currentCategoryId,
  siblingPosts,
  currentSlug,
}: PostDetailSidebarProps) {
  const tree = buildCategoryTree(categories);

  return (
    <aside className="w-full space-y-6">
      <div>
        <p className="mb-3 text-xs uppercase tracking-widest text-zinc-500">
          Categories
        </p>
        <Link
          href="/posts"
          className="mb-2 block rounded-md px-2 py-1.5 text-sm text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200"
        >
          All posts
        </Link>
        <CategoryLinks
          nodes={tree}
          depth={0}
          currentCategoryId={currentCategoryId}
        />
      </div>

      {siblingPosts.length > 0 && (
        <div>
          <p className="mb-3 text-xs uppercase tracking-widest text-zinc-500">
            In this category
          </p>
          <ul className="space-y-1">
            {siblingPosts.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/posts/${p.slug}`}
                  className={`block rounded-md px-2 py-1.5 text-sm transition-colors ${
                    p.slug === currentSlug
                      ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/30"
                      : "text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200"
                  }`}
                >
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
