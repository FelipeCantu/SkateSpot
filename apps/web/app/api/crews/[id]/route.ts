import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession, jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getAuthSession();
  const userId = (session?.user as any)?.id;

  const crew = await prisma.crew.findUnique({
    where: { id },
    include: {
      createdBy: { select: { id: true, username: true, name: true, avatar: true } },
      members: {
        include: {
          user: { select: { id: true, username: true, name: true, avatar: true, points: true, tier: true } },
        },
        orderBy: { joinedAt: "asc" },
      },
    },
  });

  if (!crew) return errorResponse("Crew not found", 404);

  const isMember = userId ? crew.members.some((m) => m.userId === userId) : false;
  const userRole = userId ? crew.members.find((m) => m.userId === userId)?.role : null;

  return jsonResponse({
    ...crew,
    memberCount: crew.members.length,
    isMember,
    userRole,
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);
  const userId = (session.user as any).id;
  const { id } = await params;

  const membership = await prisma.crewMember.findUnique({
    where: { crewId_userId: { crewId: id, userId } },
  });
  if (!membership || (membership.role !== "owner" && membership.role !== "admin")) {
    return errorResponse("Not authorized to edit this crew", 403);
  }

  const { name, description, avatar } = await req.json();
  const data: any = {};
  if (name) data.name = name;
  if (description !== undefined) data.description = description;
  if (avatar !== undefined) data.avatar = avatar;

  const crew = await prisma.crew.update({
    where: { id },
    data,
  });

  return jsonResponse(crew);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);
  const userId = (session.user as any).id;
  const { id } = await params;

  const crew = await prisma.crew.findUnique({ where: { id } });
  if (!crew) return errorResponse("Crew not found", 404);
  if (crew.createdById !== userId) return errorResponse("Only the creator can delete", 403);

  await prisma.crew.delete({ where: { id } });
  return jsonResponse({ success: true });
}
