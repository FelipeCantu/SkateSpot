import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession, jsonResponse, errorResponse, addPointsToUser, createActivityEvent } from "@/lib/api-helpers";
import { POINTS } from "@skatespot/shared";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const spotId = searchParams.get("spotId");
  const userId = searchParams.get("userId");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where: any = {};
  if (status) where.status = status;
  if (spotId) where.spotId = spotId;
  if (userId) {
    where.OR = [
      { userId },
      { participants: { some: { userId } } },
    ];
  }

  const sessions = await prisma.session.findMany({
    where,
    include: {
      user: { select: { id: true, username: true, name: true, avatar: true } },
      spot: { select: { id: true, name: true, lat: true, lng: true } },
      _count: { select: { participants: true } },
      participants: {
        include: {
          user: { select: { id: true, username: true, name: true, avatar: true } },
        },
        take: 5,
      },
    },
    orderBy: { startTime: "asc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  return jsonResponse(
    sessions.map((s) => ({
      ...s,
      participantCount: s._count.participants,
    }))
  );
}

export async function POST(req: NextRequest) {
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);
  const userId = (session.user as any).id;

  const { spotId, title, description, startTime, endTime, maxParticipants } = await req.json();
  if (!spotId || !title) return errorResponse("spotId and title required");

  const spot = await prisma.spot.findUnique({ where: { id: spotId } });
  if (!spot) return errorResponse("Spot not found", 404);

  const start = startTime ? new Date(startTime) : new Date();
  const status = start <= new Date() ? "active" : "scheduled";

  const newSession = await prisma.session.create({
    data: {
      userId,
      spotId,
      title,
      description: description || "",
      status,
      startTime: start,
      endTime: endTime ? new Date(endTime) : null,
      maxParticipants: maxParticipants || null,
    },
    include: {
      user: { select: { id: true, username: true, name: true, avatar: true } },
      spot: { select: { id: true, name: true, lat: true, lng: true } },
      _count: { select: { participants: true } },
    },
  });

  await addPointsToUser(userId, POINTS.HOST_SESSION);
  await createActivityEvent(userId, "session_hosted", newSession.id, { title, spotName: spot.name });

  return jsonResponse({ ...newSession, participantCount: newSession._count.participants }, 201);
}
