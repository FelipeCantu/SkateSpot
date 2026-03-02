import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession, jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const authSession = await getAuthSession();
  if (!authSession?.user) return errorResponse("Unauthorized", 401);
  const userId = (authSession.user as any).id;

  const existing = await prisma.sessionParticipant.findUnique({
    where: { sessionId_userId: { sessionId: id, userId } },
  });

  if (!existing) return errorResponse("Not in this session");

  await prisma.sessionParticipant.delete({ where: { id: existing.id } });
  return jsonResponse({ left: true });
}
