import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import CommentsSection from "./comments-section";
import { RichContent } from "./RichContent";
import { MarkdownContent } from "./MarkdownContent";
import { CinematicChrome } from "@/components/home-variants/cinematic-shared";
import { PostDetailSidebar } from "@/components/posts/PostDetailSidebar";
import { getCategoryBreadcrumb } from "@/lib/post-categories";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

const PROMPT = (
  <span className="text-emerald-500 font-bold">kaixun@online:~$</span>
);

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      category: { select: { id: true, name: true, slug: true } },
    },
  });

  if (!post || !post.published) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  const currentUserId = (session?.user as { id?: string } | undefined)?.id ?? null;

  const [categories, siblingPosts] = await Promise.all([
    prisma.postCategory.findMany({
      orderBy: [{ order: "asc" }, { name: "asc" }],
    }),
    post.categoryId
      ? prisma.post.findMany({
          where: { published: true, categoryId: post.categoryId },
          orderBy: { createdAt: "desc" },
          select: { id: true, title: true, slug: true },
        })
      : Promise.resolve([]),
  ]);

  const breadcrumb = getCategoryBreadcrumb(post.categoryId, categories);

  return (
    <CinematicChrome
      currentUserId={currentUserId}
      currentPath="/posts"
      simplifiedBackground
    >
      <div className="grid min-h-[calc(100vh-73px)] w-full lg:grid-cols-[14rem_minmax(0,1fr)] font-mono">
        <div className="hidden lg:block border-r border-zinc-800/50 bg-[#050505]/60 px-4 py-10">
          <div className="sticky top-[97px]">
            <PostDetailSidebar
              categories={categories}
              currentCategoryId={post.categoryId}
              siblingPosts={siblingPosts}
              currentSlug={post.slug}
            />
          </div>
        </div>

        <div className="flex min-w-0 justify-center px-4 sm:px-6 lg:px-10 xl:px-16 py-10">
          <div className="w-full max-w-3xl sm:max-w-4xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl flex flex-col gap-10">
            <div className="mb-2 flex flex-wrap items-center gap-2 text-sm sm:text-base">
              {PROMPT}{" "}
              <span className="text-zinc-100">
                <Link href="/posts" className="hover:text-emerald-400">
                  ~/posts
                </Link>
                {breadcrumb.map((cat) => (
                  <span key={cat.id}>
                    {" / "}
                    <Link
                      href={`/posts?category=${cat.slug}`}
                      className="hover:text-emerald-400"
                    >
                      {cat.name}
                    </Link>
                  </span>
                ))}
                {" / "}
                <span className="text-zinc-400">{post.slug}.md</span>
              </span>
            </div>

            <article className="rounded-xl border border-zinc-800/60 bg-[#0a0a0a]/80 backdrop-blur-md p-6 sm:p-8 text-zinc-300 space-y-6">
              <h1 className="font-tech text-2xl sm:text-3xl font-bold tracking-tight text-emerald-400">
                {post.title}
              </h1>
              <p className="text-sm text-zinc-500">
                {post.createdAt.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              {post.contentFormat === "MARKDOWN" ? (
                <MarkdownContent content={post.content} variant="dark" />
              ) : (
                <RichContent
                  contentRich={post.contentRich as any}
                  fallbackText={post.content}
                  variant="dark"
                />
              )}
            </article>

            <CommentsSection
              postId={post.id}
              currentUserId={currentUserId ?? undefined}
              variant="terminal"
            />
          </div>
        </div>
      </div>
    </CinematicChrome>
  );
}
