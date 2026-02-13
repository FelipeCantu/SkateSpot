import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession, jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);
  const userId = (session.user as any).id;
  const { id } = await params;

  const trick = await prisma.trickLog.findUnique({ where: { id } });
  if (!trick || trick.userId !== userId) return errorResponse("Not found", 404);

  const { clipId, notes } = await req.json();
  const data: any = {};
  if (clipId !== undefined) data.clipId = clipId || null;
  if (notes !== undefined) data.notes = notes;

  const updated = await prisma.trickLog.update({
    where: { id },
    data,
  });

  return jsonResponse(updated);
}
