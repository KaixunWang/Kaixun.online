import Link from "next/link";
import type { PostListItem } from "./types";

interface HomeV5Props {
  posts: PostListItem[];
}

export function HomeV5({ posts }: HomeV5Props) {
  return (
    <div className="flex min-h-screen bg-zinc-50">
      <aside className="w-56 border-r border-zinc-200 bg-white p-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-zinc-900"
        >
          kaixun.online
        </Link>
        <nav className="mt-8 space-y-1 text-sm">
          <Link
            href="/"
            className="block rounded-md px-3 py-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          >
            Home
          </Link>
          <span className="block px-3 py-2 font-medium text-zinc-900">
            Posts
          </span>
        </nav>
        <p className="mt-8 text-xs text-zinc-400">
          Personal site — posts & comments.
        </p>
      </aside>
      <main className="flex-1 p-8">
        <h1 className="mb-6 text-xl font-semibold text-zinc-900">Posts</h1>
        {posts.length === 0 ? (
          <p className="rounded-lg border border-zinc-200 bg-white p-6 text-sm text-zinc-500">
            No posts yet.
          </p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50">
                  <th className="px-4 py-3 font-medium text-zinc-900">Title</th>
                  <th className="px-4 py-3 font-medium text-zinc-900">Date</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-zinc-50">
                    <td className="border-b border-zinc-100 px-4 py-3">
                      <Link
                        href={`/posts/${post.slug}`}
                        className="font-medium text-zinc-900 hover:text-zinc-600"
                      >
                        {post.title}
                      </Link>
                    </td>
                    <td className="border-b border-zinc-100 px-4 py-3 text-zinc-500">
                      {post.createdAt.toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="mt-8 flex gap-4 text-xs text-zinc-500">
          <span className="font-medium text-zinc-700">Variants:</span>
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
        </div>
      </main>
    </div>
  );
}
