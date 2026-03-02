import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession, jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      createdBy: { select: { id: true, username: true, name: true, avatar: true } },
      spot: { select: { id: true, name: true, lat: true, lng: true } },
      participants: {
        include: {
          user: { select: { id: true, username: true, name: true, avatar: true } },
          clip: { select: { id: true, url: true, thumbnail: true, description: true } },
        },
      },
      votes: true,
    },
  });

  if (!event) return errorResponse("Event not found", 404);

  // Calculate vote counts per participant
  const participantsWithVotes = event.participants.map((p) => ({
    ...p,
    voteCount: event.votes.filter((v) => v.clipId === p.clipId).length,
  }));

  return jsonResponse({
    ...event,
    participants: participantsWithVotes,
    participantCount: event.participants.length,
    totalVotes: event.votes.length,
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);
  const userId = (session.user as any).id;

  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) return errorResponse("Event not found", 404);
  if (event.createdById !== userId) return errorResponse("Only creator can update", 403);

  const body = await req.json();
  const updated = await prisma.event.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.status !== undefined && { status: body.status }),
      ...(body.startTime !== undefined && { startTime: new Date(body.startTime) }),
      ...(body.endTime !== undefined && { endTime: new Date(body.endTime) }),
    },
  });

  return jsonResponse(updated);
}
