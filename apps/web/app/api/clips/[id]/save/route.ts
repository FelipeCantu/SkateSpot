import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession, jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);

  const { id } = await params;
  const clip = await prisma.clip.findUnique({ where: { id } });
  if (!clip) return errorResponse("Clip not found", 404);

  const existing = await prisma.save.findUnique({
    where: { userId_clipId: { userId: session.user.id, clipId: id } },
  });

  if (existing) {
    await prisma.save.delete({ where: { id: existing.id } });
    return jsonResponse({ saved: false });
  }

  await prisma.save.create({
    data: { userId: session.user.id, clipId: id },
  });

  return jsonResponse({ saved: true });
}
