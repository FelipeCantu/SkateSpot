import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession, jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function GET(req: NextRequest) {
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
  const skip = (page - 1) * limit;

  const where = { userId: session.user.id };
  const [likes, total] = await Promise.all([
    prisma.like.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.like.count({ where }),
  ]);

  const clipIds = likes.map((l) => l.clipId);
  const clips = await prisma.clip.findMany({
    where: { id: { in: clipIds } },
    include: {
      user: { select: { id: true, username: true, name: true, avatar: true } },
      spot: { select: { id: true, name: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });

  return jsonResponse({
    data: clips.map((c) => ({
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
    })),
    total,
    page,
    limit,
    hasMore: skip + limit < total,
  });
}
