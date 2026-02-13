import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession, jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);
  const currentUserId = (session.user as any).id;
  const { id: crewId, userId: targetUserId } = await params;

  // Check current user's role
  const currentMember = await prisma.crewMember.findUnique({
    where: { crewId_userId: { crewId, userId: currentUserId } },
  });
  if (!currentMember || (currentMember.role !== "owner" && currentMember.role !== "admin")) {
    return errorResponse("Not authorized", 403);
  }

  const { role } = await req.json();
  if (!["admin", "member"].includes(role)) return errorResponse("Invalid role");

  // Can't change owner
  const targetMember = await prisma.crewMember.findUnique({
    where: { crewId_userId: { crewId, userId: targetUserId } },
  });
  if (!targetMember) return errorResponse("Member not found");
  if (targetMember.role === "owner") return errorResponse("Cannot change owner role");

  await prisma.crewMember.update({
    where: { crewId_userId: { crewId, userId: targetUserId } },
    data: { role },
  });

  return jsonResponse({ success: true });
}
