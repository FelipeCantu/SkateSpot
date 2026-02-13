import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession, jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function GET(req: NextRequest) {
  const session = await getAuthSession();
  const userId = (session?.user as any)?.id;
  const { searchParams } = new URL(req.url);
  const scope = searchParams.get("scope") || "global";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "30");

  let where: any = {};

  if (scope === "friends" && userId) {
    // Get followed users
    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });
    const followingIds = following.map((f) => f.followingId);
    followingIds.push(userId); // Include own activity
    where.userId = { in: followingIds };
  } else if (scope === "crew" && userId) {
    // Get crew members
    const myCrews = await prisma.crewMember.findMany({
      where: { userId },
      select: { crewId: true },
    });
    const crewIds = myCrews.map((c) => c.crewId);
    const crewMembers = await prisma.crewMember.findMany({
      where: { crewId: { in: crewIds } },
      select: { userId: true },
    });
    const memberIds = [...new Set(crewMembers.map((m) => m.userId))];
    where.userId = { in: memberIds };
  }
  // global = no filter

  const events = await prisma.activityEvent.findMany({
    where,
    include: {
      user: { select: { id: true, username: true, name: true, avatar: true, tier: true } },
    },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  return jsonResponse(events);
}
