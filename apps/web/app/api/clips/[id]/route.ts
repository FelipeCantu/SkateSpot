import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession, jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const clip = await prisma.clip.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, username: true, name: true, avatar: true } },
      spot: { select: { id: true, name: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });

  if (!clip) return errorResponse("Clip not found", 404);

  // Increment views
  await prisma.clip.update({ where: { id }, data: { views: { increment: 1 } } });

  return jsonResponse({
    id: clip.id,
    url: clip.url,
    thumbnail: clip.thumbnail,
    description: clip.description,
    trickName: clip.trickName,
    type: clip.type,
    views: clip.views + 1,
    userId: clip.userId,
    user: clip.user,
    spotId: clip.spotId,
    spot: clip.spot,
    likes: clip._count.likes,
    comments: clip._count.comments,
    createdAt: clip.createdAt.getTime(),
  });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);

  const { id } = await params;
  const clip = await prisma.clip.findUnique({ where: { id } });
  if (!clip) return errorResponse("Clip not found", 404);
  if (clip.userId !== session.user.id)
    return errorResponse("Not authorized", 403);

  await prisma.clip.delete({ where: { id } });
  return jsonResponse({ success: true });
}
