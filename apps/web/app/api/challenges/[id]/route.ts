import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession, jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getAuthSession();

  const challenge = await prisma.challenge.findUnique({
    where: { id },
    include: {
      spot: { select: { id: true, name: true } },
      challengerClip: {
        include: {
          user: { select: { id: true, username: true, name: true, avatar: true } },
          _count: { select: { likes: true } },
        },
      },
      defenderClip: {
        include: {
          user: { select: { id: true, username: true, name: true, avatar: true } },
          _count: { select: { likes: true } },
        },
      },
      votes: { select: { userId: true, clipId: true } },
    },
  });

  if (!challenge) return errorResponse("Challenge not found", 404);

  const userVote = session?.user
    ? challenge.votes.find((v) => v.userId === (session.user as any).id)
    : null;

  return jsonResponse({
    ...challenge,
    userVotedClipId: userVote?.clipId || null,
    totalVotes: challenge.challengerVotes + challenge.defenderVotes,
  });
}
