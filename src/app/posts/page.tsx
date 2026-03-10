import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { CinematicPosts } from "@/components/home-variants/CinematicPosts";
import type { PostListItem } from "@/components/home-variants/types";

export default async function PostsPage() {
  const session = await getServerSession(authOptions);
  const currentUserId = (session?.user as { id?: string } | undefined)?.id ?? null;

  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: { id: true, title: true, slug: true, createdAt: true },
  });

  const postsList: PostListItem[] = posts.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    createdAt: p.createdAt,
  }));

  return (
    <CinematicPosts posts={postsList} currentUserId={currentUserId} />
  );
}
