import Link from "next/link";
import type { PostListItem } from "./types";

interface HomeV1Props {
  posts: PostListItem[];
}

export function HomeV1({ posts }: HomeV1Props) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] font-mono text-sm text-zinc-300">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6 border-b border-zinc-700 pb-2 text-zinc-500">
          kaixun@online:~$
        </div>
        <p className="mb-2 text-zinc-500">$ ls posts</p>
        {posts.length === 0 ? (
          <p className="text-zinc-500">(no posts yet)</p>
        ) : (
          <ul className="space-y-1">
            {posts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/posts/${post.slug}`}
                  className="block text-emerald-400 underline-offset-2 hover:underline hover:text-emerald-300"
                >
                  {post.slug}
                </Link>
                <span className="ml-2 text-zinc-600">
                  {post.createdAt.toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-6 text-zinc-500">$ cat README</p>
        <p className="mt-1 text-zinc-400">
          Personal site. Run <span className="text-white">cat post-slug</span> to
          read.
        </p>
        <p className="mt-8 flex items-center gap-1 text-zinc-500">
          <span className="inline-block h-4 w-2 animate-pulse bg-emerald-500" />
          _
        </p>
        <nav className="mt-8 border-t border-zinc-800 pt-4">
          <Link href="/" className="text-zinc-500 hover:text-zinc-300">
            ← Home
          </Link>
          <span className="mx-2 text-zinc-600">|</span>
          <Link href="/v/2" className="text-zinc-500 hover:text-zinc-300">
            v2
          </Link>
          <span className="mx-2 text-zinc-600">|</span>
          <Link href="/v/3" className="text-zinc-500 hover:text-zinc-300">
            v3
          </Link>
          <span className="mx-2 text-zinc-600">|</span>
          <Link href="/v/4" className="text-zinc-500 hover:text-zinc-300">
            v4
          </Link>
          <span className="mx-2 text-zinc-600">|</span>
          <Link href="/v/5" className="text-zinc-500 hover:text-zinc-300">
            v5
          </Link>
          <span className="mx-2 text-zinc-600">|</span>
          <Link href="/v/6" className="text-zinc-500 hover:text-zinc-300">
            v6
          </Link>
        </nav>
      </div>
    </div>
  );
}
