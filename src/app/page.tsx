import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { CinematicHome } from "@/components/home-variants/CinematicHome";

export default async function Home() {
  const session = await getServerSession(authOptions);

  let projects: Array<{
    id: string;
    title: string;
    link: string | null;
    album: string | null;
    locationName: string | null;
    latitude: number | null;
    longitude: number | null;
    order: number;
  }> = [];
  let comments: Array<{
    id: string;
    content: string;
    likeCount: number;
    createdAt: string;
    user: {
      id: string;
      displayId: string | null;
      name: string | null;
      email: string;
      image: string | null;
    };
  }> = [];

  try {
    const [projectsResult, commentsResult] = await Promise.all([
      prisma.project.findMany({ orderBy: { order: "asc" } }),
      prisma.homeComment.findMany({
        orderBy: { createdAt: "asc" },
        include: {
          user: {
            select: {
              id: true,
              displayId: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      }),
    ]);
    projects = projectsResult.map((p) => ({
      id: p.id,
      title: p.title,
      link: p.link,
      album: p.album,
      locationName: p.locationName ?? null,
      latitude: p.latitude ?? null,
      longitude: p.longitude ?? null,
      order: p.order,
    }));
    comments = commentsResult.map((c) => ({
      id: c.id,
      content: c.content,
      likeCount: c.likeCount,
      createdAt: c.createdAt.toISOString(),
      user: {
        id: c.user.id,
        displayId: c.user.displayId,
        name: c.user.name,
        email: c.user.email,
        image: c.user.image,
      },
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
