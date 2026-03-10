import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Header() {
  const session = await getServerSession(authOptions);
  const isAdmin = (session?.user as { role?: string })?.role === "ADMIN";

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-zinc-900"
        >
          kaixun.online
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/"
            className="font-medium text-zinc-600 hover:text-zinc-900"
          >
            Home
          </Link>
          <Link
            href="/v/6"
            className="font-medium text-zinc-600 hover:text-zinc-900"
          >
            v6
          </Link>
          <Link
            href="/profile"
            className="font-medium text-zinc-600 hover:text-zinc-900"
          >
            Profile
          </Link>
          {session ? (
            <>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="font-medium text-zinc-600 hover:text-zinc-900"
                >
                  Admin
                </Link>
              )}
              <span className="text-zinc-500">
                {session.user?.name ?? session.user?.email}
              </span>
              <Link
                href="/api/auth/signout"
                className="font-medium text-zinc-600 hover:text-zinc-900"
              >
                Sign out
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="font-medium text-zinc-600 hover:text-zinc-900"
              >
                Sign in
              </Link>
              <Link
                href="/auth/register"
                className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
