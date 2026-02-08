import { prisma } from "@/lib/prisma";
import { jsonResponse } from "@/lib/api-helpers";

export async function GET() {
  const topUsers = await prisma.user.findMany({
    orderBy: { points: "desc" },
    take: 20,
    select: {
      id: true,
      username: true,
      name: true,
      avatar: true,
      points: true,
      tier: true,
      _count: { select: { clips: true, followers: true } },
    },
  });

  const topSpots = await prisma.spot.findMany({
    include: {
      ratings: true,
      _count: { select: { clips: true } },
    },
    orderBy: { clips: { _count: "desc" } },
    take: 10,
  });

  return jsonResponse({
    users: topUsers.map((u) => ({
      id: u.id,
      username: u.username,
      name: u.name,
      avatar: u.avatar,
      points: u.points,
      tier: u.tier,
      clipCount: u._count.clips,
      followerCount: u._count.followers,
    })),
    spots: topSpots.map((s) => ({
      id: s.id,
      name: s.name,
      difficulty: s.difficulty,
      type: s.type,
      rating:
        s.ratings.length > 0
          ? s.ratings.reduce((sum, r) => sum + r.value, 0) / s.ratings.length
          : 0,
      clipCount: s._count.clips,
    })),
  });
}
