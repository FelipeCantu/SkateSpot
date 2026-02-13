import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession, jsonResponse, errorResponse, createNotification } from "@/lib/api-helpers";
import { CHALLENGE_DURATION_HOURS } from "@skatespot/shared";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "active";
  const spotId = searchParams.get("spotId");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where: any = { status };
  if (spotId) where.spotId = spotId;

  const challenges = await prisma.challenge.findMany({
    where,
    include: {
      spot: { select: { id: true, name: true } },
      challengerClip: {
        include: {
          user: { select: { id: true, username: true, name: true, avatar: true } },
        },
      },
      defenderClip: {
        include: {
          user: { select: { id: true, username: true, name: true, avatar: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  return jsonResponse(challenges);
}

export async function POST(req: NextRequest) {
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);
  const userId = (session.user as any).id;

  const { spotId, challengerClipId, position } = await req.json();
  if (!spotId || !challengerClipId || !position) {
    return errorResponse("spotId, challengerClipId, and position required");
  }

  // Verify challenger clip belongs to user
  const challengerClip = await prisma.clip.findUnique({
    where: { id: challengerClipId },
  });
  if (!challengerClip || challengerClip.userId !== userId) {
    return errorResponse("Invalid challenger clip");
  }

  // Find current podium holder at position
  const podium = await prisma.podiumBadge.findUnique({
    where: { spotId_position: { spotId, position } },
    include: { clip: true },
  });
  if (!podium) return errorResponse("No podium holder at this position");

  // Can't challenge yourself
  if (podium.userId === userId) {
    return errorResponse("Cannot challenge yourself");
  }

  // Check no existing active challenge for this position
  const existing = await prisma.challenge.findFirst({
    where: { spotId, position, status: "active" },
  });
  if (existing) return errorResponse("Active challenge already exists for this position");

  const expiresAt = new Date(Date.now() + CHALLENGE_DURATION_HOURS * 60 * 60 * 1000);

  const challenge = await prisma.challenge.create({
    data: {
      spotId,
      challengerClipId,
      defenderClipId: podium.clipId,
      position,
      expiresAt,
    },
    include: {
      spot: { select: { id: true, name: true } },
      challengerClip: {
        include: { user: { select: { id: true, username: true, name: true, avatar: true } } },
      },
      defenderClip: {
        include: { user: { select: { id: true, username: true, name: true, avatar: true } } },
      },
    },
  });

  await createNotification(podium.userId, userId, "challenge", challenge.id);

  return jsonResponse(challenge, 201);
}
