import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession, jsonResponse, errorResponse, createActivityEvent } from "@/lib/api-helpers";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const type = searchParams.get("type");
  const category = searchParams.get("category");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where: any = {};
  if (status) where.status = status;
  if (type) where.type = type;
  if (category) where.category = category;

  const events = await prisma.event.findMany({
    where,
    include: {
      createdBy: { select: { id: true, username: true, name: true, avatar: true } },
      spot: { select: { id: true, name: true } },
      _count: { select: { participants: true, votes: true } },
    },
    orderBy: { startTime: "asc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  return jsonResponse(
    events.map((e) => ({
      ...e,
      participantCount: e._count.participants,
      voteCount: e._count.votes,
    }))
  );
}

export async function POST(req: NextRequest) {
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);
  const userId = (session.user as any).id;

  const { name, description, type, spotId, startTime, endTime, category, prizes } = await req.json();
  if (!name || !type || !startTime || !endTime) {
    return errorResponse("name, type, startTime, and endTime are required");
  }

  if (spotId) {
    const spot = await prisma.spot.findUnique({ where: { id: spotId } });
    if (!spot) return errorResponse("Spot not found", 404);
  }

  const event = await prisma.event.create({
    data: {
      name,
      description: description || "",
      type,
      spotId: spotId || null,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      createdById: userId,
      category: category || "open",
      prizes: prizes || [],
      status: "upcoming",
    },
    include: {
      createdBy: { select: { id: true, username: true, name: true, avatar: true } },
      spot: { select: { id: true, name: true } },
      _count: { select: { participants: true } },
    },
  });

  await createActivityEvent(userId, "event_won", event.id, { name, type });

  return jsonResponse({ ...event, participantCount: event._count.participants }, 201);
}
