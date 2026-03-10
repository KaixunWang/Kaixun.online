import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import CommentsSection from "./comments-section";
import { RichContent } from "./RichContent";
import { CinematicChrome } from "@/components/home-variants/cinematic-shared";

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
  });

  if (!post || !post.published) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  const currentUserId = (session?.user as { id?: string } | undefined)?.id ?? null;

  return (
    <CinematicChrome
      currentUserId={currentUserId}
      currentPath="/posts"
      simplifiedBackground
    >
      <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-3xl flex-col gap-10 px-6 py-10 font-mono">
        <div className="mb-6 flex items-center gap-2 text-sm sm:text-base">
          {PROMPT}{" "}
          <span className="text-zinc-100">cat posts/{post.slug}.md</span>
        </div>

        <article className="rounded-xl border border-zinc-800/60 bg-[#0a0a0a]/80 backdrop-blur-md p-8 text-zinc-300 space-y-6">
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
          <RichContent
            contentRich={post.contentRich as any}
            fallbackText={post.content}
            variant="dark"
          />
        </article>

        <CommentsSection
          postId={post.id}
          currentUserId={currentUserId ?? undefined}
          variant="terminal"
        />
      </div>
    </CinematicChrome>
  );
}

