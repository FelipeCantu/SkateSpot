import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession, jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);
  const userId = (session.user as any).id;
  const { id } = await params;

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      participants: {
        include: {
          user: { select: { id: true, username: true, name: true, avatar: true } },
        },
      },
    },
  });

  if (!conversation) return errorResponse("Conversation not found", 404);

  const isParticipant = conversation.participants.some((p) => p.userId === userId);
  if (!isParticipant) return errorResponse("Unauthorized", 403);

  return jsonResponse(conversation);
}
