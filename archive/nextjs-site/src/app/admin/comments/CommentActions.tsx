"use client";

export function CommentActions({
  id,
  currentStatus,
}: {
  id: string;
  currentStatus: string;
}) {
  async function updateStatus(status: "APPROVED" | "REJECTED") {
    await fetch(`/api/admin/comments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    window.location.reload();
  }

  async function deleteComment() {
    if (!confirm("Delete this comment? This cannot be undone.")) return;
    await fetch(`/api/admin/comments/${id}`, { method: "DELETE" });
    window.location.reload();
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <button
        type="button"
        onClick={() => updateStatus("APPROVED")}
        disabled={currentStatus === "APPROVED"}
        className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 font-medium text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Approve
      </button>
      <button
        type="button"
        onClick={() => updateStatus("REJECTED")}
        disabled={currentStatus === "REJECTED"}
        className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 font-medium text-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Reject
      </button>
      <button
        type="button"
        onClick={deleteComment}
        className="rounded-md border border-red-200 bg-red-50 px-2 py-1 font-medium text-red-700"
      >
        Delete
      </button>
    </div>
  );
}
