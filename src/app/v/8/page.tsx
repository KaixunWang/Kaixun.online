import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { CinematicHome } from "@/components/home-variants/CinematicHome";

export default async function CinematicPage() {
  const session = await getServerSession(authOptions);

  let projects: Array<{ id: string; title: string; link: string | null; album: string | null; locationName: string | null; latitude: number | null; longitude: number | null; order: number }> = [];
  let comments: Array<any> = [];

  try {
    const [projectsResult, commentsResult] = await Promise.all([
      prisma.project.findMany({ orderBy: { order: "asc" } }),
      prisma.homeComment.findMany({
        orderBy: { createdAt: "asc" },
        include: {
          user: {
            select: { id: true, displayId: true, name: true, email: true, image: true },
          },
        },
      }),
    ]);
    projects = projectsResult;
    comments = commentsResult.map((c) => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
    }));
  } catch (e) {
    console.error("Home data fetch error:", e);
  }

  const currentUserId = (session?.user as { id?: string } | undefined)?.id ?? null;

  return (
    <CinematicHome
      projects={projects}
      comments={comments}
      currentUserId={currentUserId}
    />
  );
}
