import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession, jsonResponse, errorResponse } from "@/lib/api-helpers";
import { BATTLE_DURATION_HOURS } from "@skatespot/shared";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "active";
  const spotId = searchParams.get("spotId");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where: any = { status };
  if (spotId) where.spotId = spotId;

  const battles = await prisma.battle.findMany({
    where,
    include: {
      spot: { select: { id: true, name: true } },
      clip1: {
        include: {
          user: { select: { id: true, username: true, name: true, avatar: true } },
          _count: { select: { likes: true } },
        },
      },
      clip2: {
        include: {
          user: { select: { id: true, username: true, name: true, avatar: true } },
          _count: { select: { likes: true } },
        },
      },
      _count: { select: { votes: true } },
    },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  return jsonResponse(battles);
}

export async function POST(req: NextRequest) {
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);

  const { spotId, clip1Id, clip2Id } = await req.json();
  if (!spotId || !clip1Id || !clip2Id) {
    return errorResponse("spotId, clip1Id, and clip2Id required");
  }

  // Verify clips exist and are at the same spot
  const [clip1, clip2] = await Promise.all([
    prisma.clip.findUnique({ where: { id: clip1Id } }),
    prisma.clip.findUnique({ where: { id: clip2Id } }),
  ]);

  if (!clip1 || !clip2) return errorResponse("Clips not found");
  if (clip1.spotId !== spotId || clip2.spotId !== spotId) {
    return errorResponse("Both clips must be at the specified spot");
  }

  const expiresAt = new Date(Date.now() + BATTLE_DURATION_HOURS * 60 * 60 * 1000);

  const battle = await prisma.battle.create({
    data: { spotId, clip1Id, clip2Id, expiresAt },
    include: {
      spot: { select: { id: true, name: true } },
      clip1: { include: { user: { select: { id: true, username: true, name: true, avatar: true } } } },
      clip2: { include: { user: { select: { id: true, username: true, name: true, avatar: true } } } },
    },
  });

  return jsonResponse(battle, 201);
}
