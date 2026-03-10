import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ displayId: string }>;
}) {
  const { displayId } = await params;

  const user = await prisma.user.findUnique({
    where: { displayId },
    select: {
      id: true,
      displayId: true,
      name: true,
      image: true,
      email: true,
    },
  });

  if (!user) notFound();

  const maskEmail = (email: string) => {
    const [local, domain] = email.split("@");
    if (!domain) return "***";
    if (local.length <= 2) return `${local[0]}***@${domain}`;
    return `${local.slice(0, 2)}***@${domain}`;
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-zinc-900"
          >
            kaixun.online
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
          >
            Back to Home
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-md px-4 py-10">
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative h-24 w-24 overflow-hidden rounded-full bg-zinc-100">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.displayId ?? "Avatar"}
                  fill
                  className="object-cover"
                  unoptimized={user.image.startsWith("http")}
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-4xl text-zinc-400">
                  &#x1F464;
                </span>
              )}
            </div>
            <div className="text-center">
              <p className="font-medium text-zinc-900">
                {user.displayId || user.name || "User"}
              </p>
              {user.name && user.displayId && (
                <p className="text-sm text-zinc-500">{user.name}</p>
              )}
              <p className="mt-1 text-sm text-zinc-600">{maskEmail(user.email)}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
