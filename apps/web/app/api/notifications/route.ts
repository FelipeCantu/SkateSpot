import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession, jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function GET(req: NextRequest) {
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "30")));
  const skip = (page - 1) * limit;

  const where = { userId: session.user.id };

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      include: {
        sourceUser: {
          select: { id: true, username: true, name: true, avatar: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.notification.count({ where }),
  ]);

  return jsonResponse({
    data: notifications.map((n) => ({
      id: n.id,
      type: n.type,
      read: n.read,
      userId: n.userId,
      sourceUserId: n.sourceUserId,
      sourceUser: n.sourceUser,
      resourceId: n.resourceId,
      createdAt: n.createdAt.getTime(),
    })),
    total,
    page,
    limit,
    hasMore: skip + limit < total,
  });
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
