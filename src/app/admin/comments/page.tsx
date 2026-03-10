import { prisma } from "@/lib/prisma";
import { CommentActions } from "./CommentActions";

export default async function AdminCommentsPage() {
  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      post: {
        select: { id: true, title: true, slug: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
        Comments
      </h1>

      <div className="space-y-3">
        {comments.length === 0 ? (
          <p className="text-sm text-zinc-500">No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <CommentRow key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
}

function CommentRow({
  comment,
}: {
  comment: {
    id: string;
    content: string;
    status: string;
    createdAt: Date;
    user: { id: string; name: string | null; email: string };
    post: { id: string; title: string; slug: string };
  };
}) {
  const createdAt = comment.createdAt.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const statusStyles: Record<string, string> = {
    PENDING:
      "bg-amber-50 text-amber-700 border-amber-200 text-[11px] px-2 py-0.5 rounded-full border",
    APPROVED:
      "bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] px-2 py-0.5 rounded-full border",
    REJECTED:
      "bg-red-50 text-red-700 border-red-200 text-[11px] px-2 py-0.5 rounded-full border",
  };

  return (
    <div className="flex flex-col gap-2 rounded-xl bg-white p-4 shadow-sm ring-1 ring-zinc-200">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500">
        <div className="flex flex-wrap items-center gap-2">
          <span>{comment.user.name ?? comment.user.email}</span>
          <span className="text-zinc-400">·</span>
          <span>{createdAt}</span>
          <span className="text-zinc-400">·</span>
          <a
            href={`/posts/${comment.post.slug}`}
            className="font-medium text-zinc-700 hover:underline"
          >
            {comment.post.title}
          </a>
        </div>
        <span className={statusStyles[comment.status] ?? statusStyles.PENDING}>
          {comment.status}
        </span>
      </div>
      <p className="text-sm text-zinc-800">{comment.content}</p>
      <CommentActions id={comment.id} currentStatus={comment.status} />
    </div>
  );
}


