import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonResponse } from "@/lib/api-helpers";
import { BADGE_MAP } from "@skatespot/shared";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: userId } = await params;

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
