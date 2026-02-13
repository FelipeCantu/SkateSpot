import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession, jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);

  const { id } = await params;

  const notification = await prisma.notification.findUnique({ where: { id } });
  if (!notification) return errorResponse("Notification not found", 404);
  if (notification.userId !== session.user.id)
    return errorResponse("Not authorized", 403);

  await prisma.notification.update({
    where: { id },
    data: { read: true },
  });

  return jsonResponse({ success: true });
}
