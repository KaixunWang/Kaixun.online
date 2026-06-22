export interface PostCategoryRecord {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  order: number;
}

export interface PostCategoryTreeNode extends PostCategoryRecord {
  children: PostCategoryTreeNode[];
}

export interface FlatCategoryOption {
  id: string;
  name: string;
  slug: string;
  depth: number;
}

export function buildCategoryTree(
  categories: PostCategoryRecord[],
): PostCategoryTreeNode[] {
  const byId = new Map<string, PostCategoryTreeNode>();
  for (const cat of categories) {
    byId.set(cat.id, { ...cat, children: [] });
  }

  const roots: PostCategoryTreeNode[] = [];
  for (const node of byId.values()) {
    if (node.parentId && byId.has(node.parentId)) {
      byId.get(node.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  const sortNodes = (nodes: PostCategoryTreeNode[]) => {
    nodes.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
    for (const node of nodes) sortNodes(node.children);
  };
  sortNodes(roots);
  return roots;
}

export function flattenCategoryTree(
  tree: PostCategoryTreeNode[],
  depth = 0,
): FlatCategoryOption[] {
  const result: FlatCategoryOption[] = [];
  for (const node of tree) {
    result.push({ id: node.id, name: node.name, slug: node.slug, depth });
    result.push(...flattenCategoryTree(node.children, depth + 1));
  }
  return result;
}

export function getCategoryBreadcrumb(
  categoryId: string | null | undefined,
  categories: PostCategoryRecord[],
): PostCategoryRecord[] {
  if (!categoryId) return [];
  const byId = new Map(categories.map((c) => [c.id, c]));
  const trail: PostCategoryRecord[] = [];
  let current = byId.get(categoryId);
  while (current) {
    trail.unshift(current);
    current = current.parentId ? byId.get(current.parentId) : undefined;
  }
  return trail;
}

export function isDescendantCategory(
  categories: PostCategoryRecord[],
  ancestorId: string,
  candidateParentId: string | null,
): boolean {
  if (!candidateParentId) return false;
  if (candidateParentId === ancestorId) return true;
  const byId = new Map(categories.map((c) => [c.id, c]));
  let current = byId.get(candidateParentId);
  while (current?.parentId) {
    if (current.parentId === ancestorId) return true;
    current = byId.get(current.parentId);
  }
  return false;
}

export function groupPostsByCategory<T extends { categoryId: string | null }>(
  posts: T[],
  categories: PostCategoryRecord[],
): Array<{ category: PostCategoryRecord | null; posts: T[] }> {
  const tree = buildCategoryTree(categories);
  const flat = flattenCategoryTree(tree);
  const groups: Array<{ category: PostCategoryRecord | null; posts: T[] }> = [];
  const byCategory = new Map<string | null, T[]>();

  for (const post of posts) {
    const key = post.categoryId;
    if (!byCategory.has(key)) byCategory.set(key, []);
    byCategory.get(key)!.push(post);
  }

  for (const opt of flat) {
    const cat = categories.find((c) => c.id === opt.id);
    if (!cat) continue;
    const items = byCategory.get(cat.id) ?? [];
    if (items.length > 0) groups.push({ category: cat, posts: items });
  }

  const uncategorized = byCategory.get(null) ?? [];
  if (uncategorized.length > 0) {
    groups.push({ category: null, posts: uncategorized });
  }

  return groups;
}

export function findCategoryBySlug(
  categories: PostCategoryRecord[],
  slug: string,
): PostCategoryRecord | undefined {
  return categories.find((c) => c.slug === slug);
}

export function formatCategoryTreeTerminal(
  categories: PostCategoryRecord[],
  posts: Array<{ slug: string; categoryId: string | null }>,
): string {
  const tree = buildCategoryTree(categories);
  const lines: string[] = [];

  const walk = (nodes: PostCategoryTreeNode[], prefix: string) => {
    nodes.forEach((node, index) => {
      const isLast = index === nodes.length - 1;
      const branch = prefix + (isLast ? "└── " : "├── ");
      const childPrefix = prefix + (isLast ? "    " : "│   ");
      lines.push(`${branch}${node.slug}/`);
      const catPosts = posts.filter((p) => p.categoryId === node.id);
      for (const post of catPosts) {
        lines.push(`${childPrefix}├── ${post.slug}.md`);
      }
      walk(node.children, childPrefix);
    });
  };

  walk(tree, "");
  const uncategorized = posts.filter((p) => !p.categoryId);
  if (uncategorized.length > 0) {
    lines.push("└── (uncategorized)/");
    for (const post of uncategorized) {
      lines.push(`    ├── ${post.slug}.md`);
    }
  }
  return lines.length > 0 ? lines.join("\n") : "(no categories)";
}
