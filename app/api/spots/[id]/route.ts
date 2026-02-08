import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession, jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const spot = await prisma.spot.findUnique({
    where: { id },
    include: {
      images: true,
      createdBy: { select: { id: true, username: true, name: true, avatar: true } },
      ratings: true,
      clips: {
        include: {
          user: { select: { id: true, username: true, name: true, avatar: true } },
          _count: { select: { likes: true, comments: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { clips: true } },
    },
  });

  if (!spot) return errorResponse("Spot not found", 404);

  return jsonResponse({
    id: spot.id,
    name: spot.name,
    description: spot.description,
    location: [spot.lat, spot.lng],
    difficulty: spot.difficulty,
    type: spot.type,
    rating:
      spot.ratings.length > 0
        ? spot.ratings.reduce((sum, r) => sum + r.value, 0) / spot.ratings.length
        : 0,
    ratingCount: spot.ratings.length,
    features: JSON.parse(spot.features),
    images: spot.images.map((i) => i.url),
    createdBy: spot.createdBy.id,
    createdByUser: spot.createdBy,
    createdAt: spot.createdAt.getTime(),
    isVerified: spot.isVerified,
    clipCount: spot._count.clips,
    clips: spot.clips.map((c) => ({
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
      likeCount: c._count.likes,
      commentCount: c._count.comments,
      createdAt: c.createdAt.getTime(),
    })),
  });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);

  const { id } = await params;
  const spot = await prisma.spot.findUnique({ where: { id } });
  if (!spot) return errorResponse("Spot not found", 404);
  if (spot.createdById !== session.user.id)
    return errorResponse("Not authorized", 403);

  await prisma.spot.delete({ where: { id } });
  return jsonResponse({ success: true });
}
