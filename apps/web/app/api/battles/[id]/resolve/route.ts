import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession, jsonResponse, errorResponse } from "@/lib/api-helpers";
import { resolveBattle } from "@/lib/battles";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);
  const { id: battleId } = await params;

  const battle = await prisma.battle.findUnique({ where: { id: battleId } });
  if (!battle) return errorResponse("Battle not found", 404);
  if (battle.status !== "active") return errorResponse("Battle already resolved");

  // Only allow resolving after expiry
  if (new Date() < battle.expiresAt) {
    return errorResponse("Battle has not expired yet");
  }

  const result = await resolveBattle(battleId);

  return jsonResponse({
    success: true,
    winnerId: result?.winnerId || null,
  });
}
