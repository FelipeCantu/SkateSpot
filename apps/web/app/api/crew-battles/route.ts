import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession, jsonResponse, errorResponse, createActivityEvent } from "@/lib/api-helpers";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const crewId = searchParams.get("crewId");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where: any = {};
  if (status) where.status = status;
  if (crewId) {
    where.OR = [{ crew1Id: crewId }, { crew2Id: crewId }];
  }

  const battles = await prisma.crewBattle.findMany({
    where,
    include: {
      crew1: { select: { id: true, name: true, avatar: true, totalPoints: true } },
      crew2: { select: { id: true, name: true, avatar: true, totalPoints: true } },
      spot: { select: { id: true, name: true } },
      winner: { select: { id: true, name: true } },
      _count: { select: { clips: true, votes: true } },
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
  const userId = (session.user as any).id;

  const { crew1Id, crew2Id, spotId, theme, endDate } = await req.json();
  if (!crew1Id || !crew2Id || !theme) return errorResponse("crew1Id, crew2Id, and theme required");
  if (crew1Id === crew2Id) return errorResponse("Cannot battle the same crew");

  // Check user is owner/admin of crew1
  const membership = await prisma.crewMember.findFirst({
    where: { crewId: crew1Id, userId, role: { in: ["owner", "admin"] } },
  });
  if (!membership) return errorResponse("Must be crew owner or admin to create battles", 403);

  // Verify both crews exist
  const [crew1, crew2] = await Promise.all([
    prisma.crew.findUnique({ where: { id: crew1Id } }),
    prisma.crew.findUnique({ where: { id: crew2Id } }),
  ]);
  if (!crew1 || !crew2) return errorResponse("Crew not found", 404);

  const battle = await prisma.crewBattle.create({
    data: {
      crew1Id,
      crew2Id,
      spotId: spotId || null,
      theme,
      status: "active",
      startDate: new Date(),
      endDate: endDate ? new Date(endDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // default 7 days
    },
    include: {
      crew1: { select: { id: true, name: true, avatar: true, totalPoints: true } },
      crew2: { select: { id: true, name: true, avatar: true, totalPoints: true } },
      spot: { select: { id: true, name: true } },
    },
  });

  await createActivityEvent(userId, "crew_battle_won", battle.id, {
    crew1: crew1.name,
    crew2: crew2.name,
    theme,
  });

  return jsonResponse(battle, 201);
}
