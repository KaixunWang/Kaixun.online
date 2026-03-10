import Link from "next/link";
import type { PostListItem } from "./types";

interface HomeV4Props {
  posts: PostListItem[];
}

export function HomeV4({ posts }: HomeV4Props) {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-2xl px-6 py-24">
        <h1 className="text-5xl font-semibold tracking-tight text-zinc-900 md:text-6xl">
          kaixun.online
        </h1>
        <p className="mt-4 text-lg text-zinc-500">Notes and posts.</p>
        <hr className="my-16 border-0 border-t border-zinc-200" />
        {posts.length === 0 ? (
          <p className="text-zinc-400">No posts yet.</p>
        ) : (
          <ul className="space-y-0">
            {posts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/posts/${post.slug}`}
                  className="block border-b border-zinc-100 py-5 text-zinc-900 transition hover:text-zinc-600"
                >
                  <span className="font-medium">{post.title}</span>
                  <span className="ml-2 text-sm text-zinc-400">
                    {post.createdAt.toLocaleDateString()}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <nav className="mt-16 flex gap-8 text-sm text-zinc-400">
          <Link href="/" className="hover:text-zinc-900">
            Home
          </Link>
          <Link href="/v/1" className="hover:text-zinc-900">
            v1
          </Link>
          <Link href="/v/2" className="hover:text-zinc-900">
            v2
          </Link>
          <Link href="/v/3" className="hover:text-zinc-900">
            v3
          </Link>
          <Link href="/v/4" className="hover:text-zinc-900">
            v4
          </Link>
          <Link href="/v/5" className="hover:text-zinc-900">
            v5
          </Link>
          <Link href="/v/6" className="hover:text-zinc-900">
            v6
          </Link>
        </nav>
      </div>
    </div>
  );
}
