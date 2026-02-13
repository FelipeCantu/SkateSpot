import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession, jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getAuthSession();

  const battle = await prisma.battle.findUnique({
    where: { id },
    include: {
      spot: { select: { id: true, name: true } },
      clip1: {
        include: {
          user: { select: { id: true, username: true, name: true, avatar: true } },
          _count: { select: { likes: true, comments: true } },
        },
      },
      clip2: {
        include: {
          user: { select: { id: true, username: true, name: true, avatar: true } },
          _count: { select: { likes: true, comments: true } },
        },
      },
      votes: {
        select: { userId: true, clipId: true },
      },
    },
  });

  if (!battle) return errorResponse("Battle not found", 404);

  const userVote = session?.user
    ? battle.votes.find((v) => v.userId === (session.user as any).id)
    : null;

  return jsonResponse({
    ...battle,
    userVotedClipId: userVote?.clipId || null,
    totalVotes: battle.clip1Votes + battle.clip2Votes,
  });
}
