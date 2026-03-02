import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession, jsonResponse, errorResponse, addPointsToUser, createActivityEvent } from "@/lib/api-helpers";
import { POINTS } from "@skatespot/shared";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const authSession = await getAuthSession();
  if (!authSession?.user) return errorResponse("Unauthorized", 401);
  const userId = (authSession.user as any).id;

  const { status } = await req.json().catch(() => ({ status: "joined" }));

  const session = await prisma.session.findUnique({
    where: { id },
    include: { _count: { select: { participants: true } } },
  });
  if (!session) return errorResponse("Session not found", 404);
  if (session.status === "completed" || session.status === "cancelled") {
    return errorResponse("Session is no longer active");
  }

  if (session.maxParticipants && session._count.participants >= session.maxParticipants) {
    return errorResponse("Session is full");
  }

  const existing = await prisma.sessionParticipant.findUnique({
    where: { sessionId_userId: { sessionId: id, userId } },
  });

  if (existing) {
    await prisma.sessionParticipant.update({
      where: { id: existing.id },
      data: { status: status || "joined" },
    });
    return jsonResponse({ joined: true, status: status || "joined" });
  }

  await prisma.sessionParticipant.create({
    data: { sessionId: id, userId, status: status || "joined" },
  });

  if (status !== "interested") {
    await addPointsToUser(userId, POINTS.SESSION_CHECKIN);
    await createActivityEvent(userId, "session_joined", id, { title: session.title });
  }

  return jsonResponse({ joined: true, status: status || "joined" }, 201);
}
