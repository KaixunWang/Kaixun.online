export interface PostListItem {
  id: string;
  title: string;
  slug: string;
  createdAt: Date;
  categoryId: string | null;
  category?: { id: string; name: string; slug: string } | null;
}

export interface PostCategoryListItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  order: number;
}
