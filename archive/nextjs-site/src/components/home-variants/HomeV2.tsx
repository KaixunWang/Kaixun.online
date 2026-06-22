import Link from "next/link";
import type { PostListItem } from "./types";

interface HomeV2Props {
  posts: PostListItem[];
}

export function HomeV2({ posts }: HomeV2Props) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-300">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="relative mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="mb-2 font-mono text-2xl font-light tracking-widest text-white">
          kaixun.online
        </h1>
        <p className="mb-16 font-mono text-xs text-zinc-500">logs & notes</p>
        <div className="space-y-2 text-left font-mono text-sm">
          {posts.length === 0 ? (
            <div className="rounded border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-zinc-500">
              [no entries]
            </div>
          ) : (
            posts.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.slug}`}
                className="block rounded border border-zinc-800 bg-zinc-900/30 px-4 py-3 text-zinc-400 transition hover:border-zinc-600 hover:bg-zinc-800/50 hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,.06)]"
              >
                <span className="text-zinc-500">
                  [{post.createdAt.toISOString().slice(0, 10)}]
                </span>{" "}
                {post.title}
              </Link>
            ))
          )}
        </div>
        <nav className="mt-16 flex justify-center gap-6 font-mono text-xs text-zinc-500">
          <Link href="/" className="hover:text-zinc-300">
            Home
          </Link>
          <Link href="/v/1" className="hover:text-zinc-300">
            v1
          </Link>
          <Link href="/v/2" className="hover:text-zinc-300">
            v2
          </Link>
          <Link href="/v/3" className="hover:text-zinc-300">
            v3
          </Link>
          <Link href="/v/4" className="hover:text-zinc-300">
            v4
          </Link>
          <Link href="/v/5" className="hover:text-zinc-300">
            v5
          </Link>
          <Link href="/v/6" className="hover:text-zinc-300">
            v6
          </Link>
        </nav>
      </div>
    </div>
  );
}
