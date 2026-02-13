import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession, jsonResponse, errorResponse } from "@/lib/api-helpers";
import { BADGE_MAP } from "@skatespot/shared";

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);
  const userId = (session.user as any).id;

  const achievements = await prisma.achievement.findMany({
    where: { userId },
    orderBy: { unlockedAt: "desc" },
  });

  const enriched = achievements.map((a) => ({
    ...a,
    definition: BADGE_MAP[a.badgeKey] || null,
  }));

  return jsonResponse(enriched);
}
