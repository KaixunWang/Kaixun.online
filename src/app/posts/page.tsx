import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { CinematicPosts } from "@/components/home-variants/CinematicPosts";
import type { PostCategoryListItem, PostListItem } from "@/components/home-variants/types";

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: initialCategorySlug } = await searchParams;
  const session = await getServerSession(authOptions);
  const currentUserId = (session?.user as { id?: string } | undefined)?.id ?? null;

  const [posts, categories] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        title: true,
        slug: true,
        createdAt: true,
        categoryId: true,
        category: { select: { id: true, name: true, slug: true } },
      },
    }),
    prisma.postCategory.findMany({
      orderBy: [{ order: "asc" }, { name: "asc" }],
    }),
  ]);

  const postsList: PostListItem[] = posts.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    createdAt: p.createdAt,
    categoryId: p.categoryId,
    category: p.category,
  }));

  const categoriesList: PostCategoryListItem[] = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    parentId: c.parentId,
    order: c.order,
  }));

  return (
    <CinematicPosts
      posts={postsList}
      categories={categoriesList}
      currentUserId={currentUserId}
      initialCategorySlug={initialCategorySlug ?? null}
    />
  );
}
