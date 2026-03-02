import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const battle = await prisma.crewBattle.findUnique({
    where: { id },
    include: {
      crew1: {
        select: {
          id: true, name: true, avatar: true, totalPoints: true,
          members: {
            include: { user: { select: { id: true, username: true, name: true, avatar: true } } },
            take: 10,
          },
        },
      },
      crew2: {
        select: {
          id: true, name: true, avatar: true, totalPoints: true,
          members: {
            include: { user: { select: { id: true, username: true, name: true, avatar: true } } },
            take: 10,
          },
        },
      },
      spot: { select: { id: true, name: true } },
      winner: { select: { id: true, name: true } },
      clips: {
        include: {
          user: { select: { id: true, username: true, name: true, avatar: true } },
          crew: { select: { id: true, name: true } },
          clip: { select: { id: true, url: true, thumbnail: true, description: true } },
        },
      },
      votes: true,
    },
  });

  if (!battle) return errorResponse("Battle not found", 404);

  // Count votes per crew
  const crew1VoteCount = battle.votes.filter((v) =>
    battle.clips.some((c) => c.clipId === v.clipId && c.crewId === battle.crew1Id)
  ).length;
  const crew2VoteCount = battle.votes.filter((v) =>
    battle.clips.some((c) => c.clipId === v.clipId && c.crewId === battle.crew2Id)
  ).length;

  return jsonResponse({
    ...battle,
    crew1VoteCount,
    crew2VoteCount,
  });
}
