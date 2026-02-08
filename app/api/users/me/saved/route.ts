import { prisma } from "@/lib/prisma";
import { getAuthSession, jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);

  const saves = await prisma.save.findMany({
    where: { userId: session.user.id },
    include: {
      user: false,
    },
    orderBy: { createdAt: "desc" },
  });

  // Fetch full clip data for saved clips
  const clipIds = saves.map((s) => s.clipId);
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
      createdAt: c.createdAt.getTime(),
    }))
  );
}
