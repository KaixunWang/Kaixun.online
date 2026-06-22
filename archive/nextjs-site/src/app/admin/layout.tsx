import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  const role = (session?.user as any)?.role;

  if (!session || role !== "ADMIN") {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold tracking-tight text-zinc-900">
              Admin Dashboard
            </span>
            <nav className="flex items-center gap-3 text-xs font-medium text-zinc-600">
              <Link
                href="/admin"
                className="rounded-md px-2 py-1 hover:bg-zinc-100"
              >
                Overview
              </Link>
              <Link
                href="/admin/posts"
                className="rounded-md px-2 py-1 hover:bg-zinc-100"
              >
                Posts
              </Link>
              <Link
                href="/admin/categories"
                className="rounded-md px-2 py-1 hover:bg-zinc-100"
              >
                Categories
              </Link>
              <Link
                href="/admin/projects"
                className="rounded-md px-2 py-1 hover:bg-zinc-100"
              >
                Projects
              </Link>
              <Link
                href="/admin/comments"
                className="rounded-md px-2 py-1 hover:bg-zinc-100"
              >
                Comments
              </Link>
            </nav>
          </div>
          <Link
            href="/"
            className="text-xs font-medium text-zinc-500 hover:text-zinc-900"
          >
            Back to site
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}

