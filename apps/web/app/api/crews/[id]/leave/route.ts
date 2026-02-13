import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession, jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);
  const userId = (session.user as any).id;
  const { id: crewId } = await params;

  const membership = await prisma.crewMember.findUnique({
    where: { crewId_userId: { crewId, userId } },
  });
  if (!membership) return errorResponse("Not a member");
  if (membership.role === "owner") return errorResponse("Owner cannot leave. Delete the crew instead.");

  await prisma.crewMember.delete({
    where: { crewId_userId: { crewId, userId } },
  });

  // Subtract user's points from crew
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user) {
    await prisma.crew.update({
      where: { id: crewId },
      data: { totalPoints: { decrement: user.points } },
    });
  }

  return jsonResponse({ success: true });
}
