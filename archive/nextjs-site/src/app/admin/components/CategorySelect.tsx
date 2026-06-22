"use client";

import { useEffect, useState } from "react";
import {
  buildCategoryTree,
  flattenCategoryTree,
  type PostCategoryRecord,
} from "@/lib/post-categories";

interface CategorySelectProps {
  value: string;
  onChange: (categoryId: string) => void;
}

export function CategorySelect({ value, onChange }: CategorySelectProps) {
  const [categories, setCategories] = useState<PostCategoryRecord[]>([]);

  useEffect(() => {
    void fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((data) => setCategories(data));
  }, []);

  const options = flattenCategoryTree(buildCategoryTree(categories));

  return (
    <select
      className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">(uncategorized)</option>
      {options.map((opt) => (
        <option key={opt.id} value={opt.id}>
          {"—".repeat(opt.depth)} {opt.name}
        </option>
      ))}
    </select>
  );
}
