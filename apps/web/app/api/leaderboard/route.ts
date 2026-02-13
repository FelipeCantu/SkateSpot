import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonResponse } from "@/lib/api-helpers";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userLimit = Math.min(50, Math.max(1, parseInt(searchParams.get("userLimit") || "20")));
  const spotLimit = Math.min(50, Math.max(1, parseInt(searchParams.get("spotLimit") || "10")));
  const crewLimit = Math.min(50, Math.max(1, parseInt(searchParams.get("crewLimit") || "10")));

  const [topUsers, topSpots, topCrews] = await Promise.all([
    prisma.user.findMany({
      orderBy: { points: "desc" },
      take: userLimit,
      select: {
        id: true,
        username: true,
        name: true,
        avatar: true,
        points: true,
        tier: true,
        _count: { select: { clips: true, followers: true } },
      },
    }),
    prisma.spot.findMany({
      include: {
        ratings: true,
        _count: { select: { clips: true } },
      },
      orderBy: { clips: { _count: "desc" } },
      take: spotLimit,
    }),
    prisma.crew.findMany({
      orderBy: { totalPoints: "desc" },
      take: crewLimit,
      select: {
        id: true,
        name: true,
        totalPoints: true,
        _count: { select: { members: true } },
      },
    }),
  ]);

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
    crews: topCrews.map((c) => ({
      id: c.id,
      name: c.name,
      totalPoints: c.totalPoints,
      memberCount: c._count.members,
    })),
  });
}
