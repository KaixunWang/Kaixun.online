import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { HomeV1 } from "@/components/home-variants/HomeV1";
import { HomeV2 } from "@/components/home-variants/HomeV2";
import { HomeV3 } from "@/components/home-variants/HomeV3";
import { HomeV4 } from "@/components/home-variants/HomeV4";
import { HomeV5 } from "@/components/home-variants/HomeV5";
import { HomeV6 } from "@/components/home-variants/HomeV6";
import type { PostListItem } from "@/components/home-variants/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

const VARIANTS: Record<string, React.ComponentType<{ posts: PostListItem[] }>> = {
  "1": HomeV1,
  "2": HomeV2,
  "3": HomeV3,
  "4": HomeV4,
  "5": HomeV5,
  // "6": HomeV6,
};

export default async function VariantHomePage({ params }: PageProps) {
  const { id } = await params;
  if (!VARIANTS[id]) notFound();

  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: { id: true, title: true, slug: true, createdAt: true, categoryId: true },
  });

  const postsList: PostListItem[] = posts.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    createdAt: p.createdAt,
    categoryId: p.categoryId,
  }));

  const Variant = VARIANTS[id];
  return <Variant posts={postsList} />;
}
