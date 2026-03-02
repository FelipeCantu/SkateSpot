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

  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) return errorResponse("Event not found", 404);
  if (event.status !== "voting" && event.status !== "active") {
    return errorResponse("Event is not accepting votes");
  }

  // One vote per user per event
  const existing = await prisma.eventVote.findUnique({
    where: { eventId_userId: { eventId: id, userId } },
  });
  if (existing) return errorResponse("Already voted in this event");

  // Verify clip is from a participant
  const participant = await prisma.eventParticipant.findFirst({
    where: { eventId: id, clipId },
  });
  if (!participant) return errorResponse("Clip is not part of this event");

  const vote = await prisma.eventVote.create({
    data: { eventId: id, clipId, userId },
  });

  return jsonResponse(vote, 201);
}
