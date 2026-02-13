import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getAuthSession,
  jsonResponse,
  errorResponse,
  addPointsToUser,
  createNotification,
} from "@/lib/api-helpers";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
  const skip = (page - 1) * limit;

  const where = { clipId: id };

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where,
      include: {
        user: { select: { id: true, username: true, name: true, avatar: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.comment.count({ where }),
  ]);

  return jsonResponse({
    data: comments.map((c) => ({
      id: c.id,
      content: c.content,
      userId: c.userId,
      user: c.user,
      clipId: c.clipId,
      createdAt: c.createdAt.getTime(),
    })),
    total,
    page,
    limit,
    hasMore: skip + limit < total,
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);

  const { id } = await params;
  const { content } = await req.json();

  if (!content?.trim()) return errorResponse("Content is required");

  const clip = await prisma.clip.findUnique({ where: { id } });
  if (!clip) return errorResponse("Clip not found", 404);

  const comment = await prisma.comment.create({
    data: {
      content: content.trim(),
      userId: session.user.id,
      clipId: id,
    },
    include: {
      user: { select: { id: true, username: true, name: true, avatar: true } },
    },
  });

  await addPointsToUser(clip.userId, 10);
  await createNotification(clip.userId, session.user.id, "comment", id);

  return jsonResponse(
    {
      id: comment.id,
      content: comment.content,
      userId: comment.userId,
      user: comment.user,
      clipId: comment.clipId,
      createdAt: comment.createdAt.getTime(),
    },
    201
  );
}
