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
  if (battle.status !== "active" && battle.status !== "voting") {
    return errorResponse("Battle is not accepting votes");
  }

  // Cannot vote if member of either crew
  const membership = await prisma.crewMember.findFirst({
    where: {
      userId,
      crewId: { in: [battle.crew1Id, battle.crew2Id] },
    },
  });
  if (membership) return errorResponse("Members of participating crews cannot vote", 403);

  // One vote per user per battle
  const existing = await prisma.crewBattleVote.findUnique({
    where: { battleId_userId: { battleId: id, userId } },
  });
  if (existing) return errorResponse("Already voted in this battle");

  const vote = await prisma.crewBattleVote.create({
    data: { battleId: id, clipId, userId },
  });

  return jsonResponse(vote, 201);
}
