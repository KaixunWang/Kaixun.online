"use client";

import { useState } from "react";
import {
  buildCategoryTree,
  type PostCategoryRecord,
  type PostCategoryTreeNode,
} from "@/lib/post-categories";

interface PostCategoryTreeProps {
  categories: PostCategoryRecord[];
  selectedId: string | null;
  onSelect: (categoryId: string | null) => void;
  variant?: "sidebar" | "compact";
}

function TreeNode({
  node,
  selectedId,
  onSelect,
  depth,
  variant,
}: {
  node: PostCategoryTreeNode;
  selectedId: string | null;
  onSelect: (categoryId: string | null) => void;
  depth: number;
  variant: "sidebar" | "compact";
}) {
  const [open, setOpen] = useState(true);
  const hasChildren = node.children.length > 0;
  const isSelected = selectedId === node.id;

  const btnClass =
    variant === "sidebar"
      ? `w-full text-left rounded-md px-2 py-1.5 text-sm transition-colors ${
          isSelected
            ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/30"
            : "text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200"
        }`
      : `rounded px-2 py-1 text-xs ${
          isSelected ? "text-emerald-400" : "text-zinc-500 hover:text-zinc-300"
        }`;

  return (
    <div>
      <div className="flex items-center gap-1" style={{ paddingLeft: depth * 12 }}>
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="shrink-0 text-zinc-600 hover:text-zinc-300 text-xs w-4"
            aria-label={open ? "Collapse" : "Expand"}
          >
            {open ? "▾" : "▸"}
          </button>
        ) : (
          <span className="w-4 shrink-0" />
        )}
        <button type="button" onClick={() => onSelect(node.id)} className={btnClass}>
          {node.name}
        </button>
      </div>
      {hasChildren && open && (
        <div className="mt-0.5">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              selectedId={selectedId}
              onSelect={onSelect}
              depth={depth + 1}
              variant={variant}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function PostCategoryTree({
  categories,
  selectedId,
  onSelect,
  variant = "sidebar",
}: PostCategoryTreeProps) {
  const tree = buildCategoryTree(categories);

  const allBtnClass =
    variant === "sidebar"
      ? `mb-2 w-full text-left rounded-md px-2 py-1.5 text-sm transition-colors ${
          selectedId === null
            ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/30"
            : "text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200"
        }`
      : `mb-2 rounded px-2 py-1 text-xs ${
          selectedId === null ? "text-emerald-400" : "text-zinc-500 hover:text-zinc-300"
        }`;

  return (
    <nav className={variant === "sidebar" ? "space-y-1" : "flex flex-wrap gap-1"}>
      <button type="button" onClick={() => onSelect(null)} className={allBtnClass}>
        All posts
      </button>
      {variant === "sidebar" ? (
        tree.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            selectedId={selectedId}
            onSelect={onSelect}
            depth={0}
            variant={variant}
          />
        ))
      ) : (
        tree.map((node) => (
          <button
            key={node.id}
            type="button"
            onClick={() => onSelect(node.id)}
            className={
              selectedId === node.id
                ? "text-emerald-400 text-xs"
                : "text-zinc-500 hover:text-zinc-300 text-xs"
            }
          >
            {node.name}
          </button>
        ))
      )}
    </nav>
  );
}
