import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession, jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);
  const userId = (session.user as any).id;

  const { clipId } = await req.json();
  if (!clipId) return errorResponse("clipId required");

  const battle = await prisma.crewBattle.findUnique({ where: { id } });
  if (!battle) return errorResponse("Battle not found", 404);
  if (battle.status !== "active") return errorResponse("Battle is not accepting clips");

  // Check user is a member of a participating crew
  const membership = await prisma.crewMember.findFirst({
    where: {
      userId,
      crewId: { in: [battle.crew1Id, battle.crew2Id] },
    },
  });
  if (!membership) return errorResponse("Must be a member of a participating crew", 403);

  // Check clip exists
  const clip = await prisma.clip.findUnique({ where: { id: clipId } });
  if (!clip) return errorResponse("Clip not found", 404);

  // Check clip isn't already submitted
  const existing = await prisma.crewBattleClip.findUnique({
    where: { battleId_clipId: { battleId: id, clipId } },
  });
  if (existing) return errorResponse("Clip already submitted to this battle");

  const battleClip = await prisma.crewBattleClip.create({
    data: {
      battleId: id,
      crewId: membership.crewId,
      clipId,
      userId,
    },
    include: {
      user: { select: { id: true, username: true, name: true, avatar: true } },
      clip: { select: { id: true, url: true, thumbnail: true, description: true } },
    },
  });

  return jsonResponse(battleClip, 201);
}
