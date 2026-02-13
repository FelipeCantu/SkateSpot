import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getAuthSession, jsonResponse, errorResponse,
  addPointsToUser, createNotification, createActivityEvent,
} from "@/lib/api-helpers";
import { recalculatePodium } from "@/lib/battles";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);
  const userId = (session.user as any).id;
  const { id: challengeId } = await params;

  const { clipId } = await req.json();
  if (!clipId) return errorResponse("clipId required");

  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
    include: { challengerClip: true, defenderClip: true },
  });
  if (!challenge) return errorResponse("Challenge not found", 404);
  if (challenge.status !== "active") return errorResponse("Challenge is not active");
  if (new Date() > challenge.expiresAt) {
    // Auto-resolve expired challenge
    await resolveChallenge(challengeId);
    return errorResponse("Challenge has expired and been resolved");
  }
  if (clipId !== challenge.challengerClipId && clipId !== challenge.defenderClipId) {
    return errorResponse("Invalid clipId for this challenge");
  }

  const existingVote = await prisma.challengeVote.findUnique({
    where: { challengeId_userId: { challengeId, userId } },
  });
  if (existingVote) return errorResponse("Already voted");

  await prisma.challengeVote.create({
    data: { challengeId, userId, clipId },
  });

  const updateField = clipId === challenge.challengerClipId
    ? "challengerVotes"
    : "defenderVotes";
  await prisma.challenge.update({
    where: { id: challengeId },
    data: { [updateField]: { increment: 1 } },
  });

  await addPointsToUser(userId, 2);

  return jsonResponse({ success: true });
}

async function resolveChallenge(challengeId: string) {
  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
    include: { challengerClip: true, defenderClip: true },
  });
  if (!challenge || challenge.status !== "active") return;

  let winnerId: string | null = null;
  let winnerUserId: string | null = null;

  if (challenge.challengerVotes > challenge.defenderVotes) {
    winnerId = challenge.challengerClipId;
    winnerUserId = challenge.challengerClip.userId;
    await addPointsToUser(winnerUserId, 150);
    await createActivityEvent(winnerUserId, "challenge_won", challengeId);
  } else if (challenge.defenderVotes > challenge.challengerVotes) {
    winnerId = challenge.defenderClipId;
    winnerUserId = challenge.defenderClip.userId;
  }

  await prisma.challenge.update({
    where: { id: challengeId },
    data: { status: "completed", winnerId },
  });

  if (winnerUserId) {
    await recalculatePodium(challenge.spotId);
  }
}
