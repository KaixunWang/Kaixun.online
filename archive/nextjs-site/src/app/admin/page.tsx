import { prisma } from "@/lib/prisma";

export default async function AdminHomePage() {
  const [postCount, commentCount, pendingCommentCount, userCount] =
    await Promise.all([
      prisma.post.count(),
      prisma.comment.count(),
      prisma.comment.count({ where: { status: "PENDING" } }),
      prisma.user.count(),
    ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
        Overview
      </h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-xs font-medium uppercase text-zinc-500">Posts</p>
          <p className="mt-2 text-2xl font-semibold text-zinc-900">
            {postCount}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-xs font-medium uppercase text-zinc-500">
            Comments
          </p>
          <p className="mt-2 text-2xl font-semibold text-zinc-900">
            {commentCount}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-xs font-medium uppercase text-zinc-500">
            Pending comments
          </p>
          <p className="mt-2 text-2xl font-semibold text-amber-600">
            {pendingCommentCount}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <p className="text-xs font-medium uppercase text-zinc-500">Users</p>
          <p className="mt-2 text-2xl font-semibold text-zinc-900">
            {userCount}
          </p>
        </div>
      </div>
    </div>
  );
}

