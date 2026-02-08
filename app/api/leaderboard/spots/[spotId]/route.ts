import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ spotId: string }> }
) {
  const { spotId } = await params;

  const spot = await prisma.spot.findUnique({ where: { id: spotId } });
  if (!spot) return errorResponse("Spot not found", 404);

  // "King of the Spot" = users with most likes on their clips at this spot
  const clips = await prisma.clip.findMany({
    where: { spotId },
    include: {
      user: { select: { id: true, username: true, name: true, avatar: true, tier: true } },
      _count: { select: { likes: true } },
    },
  });

  // Aggregate likes per user
  const userLikes: Record<string, { user: any; totalLikes: number; clipCount: number }> = {};
  for (const clip of clips) {
    const uid = clip.userId;
    if (!userLikes[uid]) {
      userLikes[uid] = { user: clip.user, totalLikes: 0, clipCount: 0 };
    }
    userLikes[uid].totalLikes += clip._count.likes;
    userLikes[uid].clipCount += 1;
  }

  const leaderboard = Object.values(userLikes)
    .sort((a, b) => b.totalLikes - a.totalLikes)
    .slice(0, 10)
    .map((entry, i) => ({
      rank: i + 1,
      user: entry.user,
      totalLikes: entry.totalLikes,
      clipCount: entry.clipCount,
    }));

  return jsonResponse({ spotId, spotName: spot.name, leaderboard });
}
