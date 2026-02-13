import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession, jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function GET(req: NextRequest) {
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);
  const userId = (session.user as any).id;

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
  const skip = (page - 1) * limit;

  const where = { participants: { some: { userId } } };

  const [conversations, total] = await Promise.all([
    prisma.conversation.findMany({
      where,
      include: {
        participants: {
          include: {
            user: { select: { id: true, username: true, name: true, avatar: true } },
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            sender: { select: { id: true, username: true, name: true } },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.conversation.count({ where }),
  ]);

  const formatted = conversations.map((c) => {
    const otherParticipants = c.participants.filter((p) => p.userId !== userId);
    const myParticipant = c.participants.find((p) => p.userId === userId);
    const lastMessage = c.messages[0] || null;
    const unread = lastMessage && myParticipant
      ? new Date(lastMessage.createdAt) > new Date(myParticipant.lastReadAt)
      : false;

    return {
      id: c.id,
      participants: otherParticipants.map((p) => p.user),
      lastMessage: lastMessage ? {
        id: lastMessage.id,
        content: lastMessage.content,
        type: lastMessage.type,
        sender: lastMessage.sender,
        createdAt: lastMessage.createdAt,
      } : null,
      unread,
      updatedAt: c.updatedAt,
    };
  });

  return jsonResponse({ data: formatted, total, page, limit, hasMore: skip + limit < total });
}

export async function POST(req: NextRequest) {
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);
  const userId = (session.user as any).id;

  const { participantId } = await req.json();
  if (!participantId) return errorResponse("participantId required");
  if (participantId === userId) return errorResponse("Cannot message yourself");

  // Check if conversation already exists between these two users
  const existing = await prisma.conversation.findFirst({
    where: {
      AND: [
        { participants: { some: { userId } } },
        { participants: { some: { userId: participantId } } },
      ],
    },
    include: {
      participants: {
        include: {
          user: { select: { id: true, username: true, name: true, avatar: true } },
        },
      },
    },
  });

  if (existing) return jsonResponse(existing);

  const conversation = await prisma.conversation.create({
    data: {
      participants: {
        create: [
          { userId },
          { userId: participantId },
        ],
      },
    },
    include: {
      participants: {
        include: {
          user: { select: { id: true, username: true, name: true, avatar: true } },
        },
      },
    },
  });

  return jsonResponse(conversation, 201);
}
