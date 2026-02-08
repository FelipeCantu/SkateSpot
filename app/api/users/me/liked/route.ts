import { prisma } from "@/lib/prisma";
import { getAuthSession, jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);

  const likes = await prisma.like.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const clipIds = likes.map((l) => l.clipId);
  const clips = await prisma.clip.findMany({
    where: { id: { in: clipIds } },
    include: {
      user: { select: { id: true, username: true, name: true, avatar: true } },
      spot: { select: { id: true, name: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });

  return jsonResponse(
    clips.map((c) => ({
      id: c.id,
      url: c.url,
      thumbnail: c.thumbnail,
      description: c.description,
      trickName: c.trickName,
      type: c.type,
      views: c.views,
      userId: c.userId,
      user: c.user,
      spotId: c.spotId,
      spot: c.spot,
      likes: c._count.likes,
      comments: c._count.comments,
      isLiked: true,
      createdAt: c.createdAt.getTime(),
    }))
  );
}
