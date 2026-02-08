import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession, jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    include: {
      sourceUser: {
        select: { id: true, username: true, name: true, avatar: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return jsonResponse(
    notifications.map((n) => ({
      id: n.id,
      type: n.type,
      read: n.read,
      userId: n.userId,
      sourceUserId: n.sourceUserId,
      sourceUser: n.sourceUser,
      resourceId: n.resourceId,
      createdAt: n.createdAt.getTime(),
    }))
  );
}

export async function PATCH() {
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);

  await prisma.notification.updateMany({
    where: { userId: session.user.id, read: false },
    data: { read: true },
  });

  return jsonResponse({ success: true });
}
