import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession, jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);
  const userId = (session.user as any).id;

  const { clipId } = await req.json().catch(() => ({ clipId: undefined }));

  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) return errorResponse("Event not found", 404);
  if (event.status === "completed") return errorResponse("Event has ended");

  // For contests, clipId is required
  if (event.type === "contest" && !clipId) {
    return errorResponse("Clip submission required for contests");
  }

  if (clipId) {
    const clip = await prisma.clip.findUnique({ where: { id: clipId } });
    if (!clip) return errorResponse("Clip not found", 404);
  }

  const existing = await prisma.eventParticipant.findUnique({
    where: { eventId_userId: { eventId: id, userId } },
  });
  if (existing) return errorResponse("Already joined this event");

  const participant = await prisma.eventParticipant.create({
    data: {
      eventId: id,
      userId,
      clipId: clipId || null,
    },
    include: {
      user: { select: { id: true, username: true, name: true, avatar: true } },
    },
  });

  return jsonResponse(participant, 201);
}
