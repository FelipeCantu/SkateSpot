import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession, jsonResponse, errorResponse, addPointsToUser, createActivityEvent } from "@/lib/api-helpers";
import { POINTS } from "@skatespot/shared";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);
  const userId = (session.user as any).id;

  const battle = await prisma.crewBattle.findUnique({
    where: { id },
    include: {
      clips: true,
      votes: true,
      crew1: { include: { members: true } },
      crew2: { include: { members: true } },
    },
  });
  if (!battle) return errorResponse("Battle not found", 404);
  if (battle.status === "completed") return errorResponse("Battle already resolved");

  // Must be admin/owner of crew1 (challenger)
  const membership = await prisma.crewMember.findFirst({
    where: { crewId: battle.crew1Id, userId, role: { in: ["owner", "admin"] } },
  });
  if (!membership) return errorResponse("Only battle creator crew admin can resolve", 403);

  // Count votes per crew
  const crew1ClipIds = battle.clips.filter((c) => c.crewId === battle.crew1Id).map((c) => c.clipId);
  const crew2ClipIds = battle.clips.filter((c) => c.crewId === battle.crew2Id).map((c) => c.clipId);

  const crew1Votes = battle.votes.filter((v) => crew1ClipIds.includes(v.clipId)).length;
  const crew2Votes = battle.votes.filter((v) => crew2ClipIds.includes(v.clipId)).length;

  const winnerId = crew1Votes >= crew2Votes ? battle.crew1Id : battle.crew2Id;
  const winningMembers = winnerId === battle.crew1Id ? battle.crew1.members : battle.crew2.members;

  // Update battle
  const updated = await prisma.crewBattle.update({
    where: { id },
    data: { status: "completed", winnerId },
    include: {
      crew1: { select: { id: true, name: true } },
      crew2: { select: { id: true, name: true } },
      winner: { select: { id: true, name: true } },
    },
  });

  // Award points to winning crew members
  for (const member of winningMembers) {
    await addPointsToUser(member.userId, POINTS.WIN_CREW_BATTLE);
    await createActivityEvent(member.userId, "crew_battle_won", id, {
      crewName: updated.winner?.name,
    });
  }

  return jsonResponse({
    ...updated,
    crew1Votes,
    crew2Votes,
  });
}
