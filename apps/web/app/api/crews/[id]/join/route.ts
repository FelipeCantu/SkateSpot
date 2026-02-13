import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession, jsonResponse, errorResponse, createActivityEvent } from "@/lib/api-helpers";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);
  const userId = (session.user as any).id;
  const { id: crewId } = await params;

  const crew = await prisma.crew.findUnique({ where: { id: crewId } });
  if (!crew) return errorResponse("Crew not found", 404);

  const existing = await prisma.crewMember.findUnique({
    where: { crewId_userId: { crewId, userId } },
  });
  if (existing) return errorResponse("Already a member");

  await prisma.crewMember.create({
    data: { crewId, userId, role: "member" },
  });

  // Add user's points to crew
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user) {
    await prisma.crew.update({
      where: { id: crewId },
      data: { totalPoints: { increment: user.points } },
    });
  }

  await createActivityEvent(userId, "crew_joined", crewId, { crewName: crew.name });

  return jsonResponse({ success: true });
}
