import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession, jsonResponse, errorResponse, addPointsToUser } from "@/lib/api-helpers";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);
  const userId = (session.user as any).id;
  const { id: battleId } = await params;

  const { clipId } = await req.json();
  if (!clipId) return errorResponse("clipId required");

  const battle = await prisma.battle.findUnique({ where: { id: battleId } });
  if (!battle) return errorResponse("Battle not found", 404);
  if (battle.status !== "active") return errorResponse("Battle is not active");
  if (new Date() > battle.expiresAt) return errorResponse("Battle has expired");
  if (clipId !== battle.clip1Id && clipId !== battle.clip2Id) {
    return errorResponse("Invalid clipId for this battle");
  }

  // Check if user already voted
  const existingVote = await prisma.battleVote.findUnique({
    where: { battleId_userId: { battleId, userId } },
  });
  if (existingVote) return errorResponse("Already voted");

  await prisma.battleVote.create({
    data: { battleId, userId, clipId },
  });

  // Increment vote count
  const updateField = clipId === battle.clip1Id ? "clip1Votes" : "clip2Votes";
  await prisma.battle.update({
    where: { id: battleId },
    data: { [updateField]: { increment: 1 } },
  });

  // Award points for voting
  await addPointsToUser(userId, 2);

  return jsonResponse({ success: true });
}
