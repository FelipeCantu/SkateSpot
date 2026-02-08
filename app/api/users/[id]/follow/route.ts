import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getAuthSession,
  jsonResponse,
  errorResponse,
  addPointsToUser,
  createNotification,
} from "@/lib/api-helpers";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);

  const { id } = await params;
  if (id === session.user.id) return errorResponse("Cannot follow yourself");

  const targetUser = await prisma.user.findUnique({ where: { id } });
  if (!targetUser) return errorResponse("User not found", 404);

  const existing = await prisma.follow.findUnique({
    where: {
      followerId_followingId: { followerId: session.user.id, followingId: id },
    },
  });

  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } });
    return jsonResponse({ following: false });
  }

  await prisma.follow.create({
    data: { followerId: session.user.id, followingId: id },
  });

  await addPointsToUser(id, 5);
  await createNotification(id, session.user.id, "follow");

  return jsonResponse({ following: true });
}
