import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession, jsonResponse, errorResponse, addPointsToUser, createActivityEvent } from "@/lib/api-helpers";
import { POINTS } from "@skatespot/shared";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
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

  const ranked = event.participants
    .map((p) => ({
      ...p,
      voteCount: event.votes.filter((v) => v.clipId === p.clipId).length,
    }))
    .sort((a, b) => b.voteCount - a.voteCount);

  return jsonResponse(ranked);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);
  const userId = (session.user as any).id;

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      participants: {
        include: { user: true },
      },
      votes: true,
    },
  });

  if (!event) return errorResponse("Event not found", 404);
  if (event.createdById !== userId) return errorResponse("Only creator can finalize", 403);
  if (event.status === "completed") return errorResponse("Event already finalized");

  // Rank participants by votes
  const ranked = event.participants
    .map((p) => ({
      ...p,
      voteCount: event.votes.filter((v) => v.clipId === p.clipId).length,
    }))
    .sort((a, b) => b.voteCount - a.voteCount);

  // Award points to top 3
  const prizeAmounts = [POINTS.WIN_EVENT_FIRST, POINTS.WIN_EVENT_SECOND, POINTS.WIN_EVENT_THIRD];
  for (let i = 0; i < Math.min(3, ranked.length); i++) {
    await addPointsToUser(ranked[i].userId, prizeAmounts[i]);
    await createActivityEvent(ranked[i].userId, "event_won", id, {
      eventName: event.name,
      place: i + 1,
    });

    // Check event_winner badge for 1st place
    if (i === 0) {
      const existingBadge = await prisma.achievement.findFirst({
        where: { userId: ranked[i].userId, badgeKey: "event_winner" },
      });
      if (!existingBadge) {
        await prisma.achievement.create({
          data: { userId: ranked[i].userId, badgeKey: "event_winner" },
        });
      }
    }
  }

  // Mark event as completed
  const updated = await prisma.event.update({
    where: { id },
    data: { status: "completed" },
  });

  return jsonResponse({
    ...updated,
    results: ranked.map((r, i) => ({
      place: i + 1,
      userId: r.userId,
      username: r.user.username,
      voteCount: r.voteCount,
      pointsAwarded: i < 3 ? prizeAmounts[i] : 0,
    })),
  });
}
