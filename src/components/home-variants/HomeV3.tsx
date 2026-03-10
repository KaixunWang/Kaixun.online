import Link from "next/link";
import type { PostListItem } from "./types";

interface HomeV3Props {
  posts: PostListItem[];
}

export function HomeV3({ posts }: HomeV3Props) {
  const [feature, ...rest] = posts;
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="mb-10 text-center text-2xl font-semibold tracking-tight text-zinc-900">
          kaixun.online
        </h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-2">
          {feature && (
            <Link
              href={`/posts/${feature.slug}`}
              className="rounded-xl border-2 border-zinc-800 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-900 hover:shadow-md md:col-span-2 md:row-span-2 md:flex md:flex-col md:justify-center"
            >
              <h2 className="text-xl font-semibold text-zinc-900">
                {feature.title}
              </h2>
              <p className="mt-2 text-sm text-zinc-500">
                {feature.createdAt.toLocaleDateString()}
              </p>
            </Link>
          )}
          {rest.slice(0, 4).map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.slug}`}
              className="rounded-xl border-2 border-zinc-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-zinc-400 hover:shadow"
            >
              <h2 className="font-medium text-zinc-900">{post.title}</h2>
              <p className="mt-1 text-xs text-zinc-500">
                {post.createdAt.toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
        {posts.length === 0 && (
          <div className="rounded-xl border-2 border-zinc-200 bg-white p-8 text-center text-zinc-500">
            No posts yet.
          </div>
        )}
        <nav className="mt-12 flex justify-center gap-4 text-sm text-zinc-600">
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
