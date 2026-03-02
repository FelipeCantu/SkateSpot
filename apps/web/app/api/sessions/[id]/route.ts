import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession, jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await prisma.session.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, username: true, name: true, avatar: true } },
      spot: { select: { id: true, name: true, lat: true, lng: true } },
      participants: {
        include: {
          user: { select: { id: true, username: true, name: true, avatar: true } },
        },
      },
    },
  });

  if (!session) return errorResponse("Session not found", 404);
  return jsonResponse(session);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const authSession = await getAuthSession();
  if (!authSession?.user) return errorResponse("Unauthorized", 401);
  const userId = (authSession.user as any).id;

  const existing = await prisma.session.findUnique({ where: { id } });
  if (!existing) return errorResponse("Session not found", 404);
  if (existing.userId !== userId) return errorResponse("Only host can update", 403);

  const body = await req.json();
  const updated = await prisma.session.update({
    where: { id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.status !== undefined && { status: body.status }),
      ...(body.endTime !== undefined && { endTime: new Date(body.endTime) }),
      ...(body.maxParticipants !== undefined && { maxParticipants: body.maxParticipants }),
    },
  });

  return jsonResponse(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const authSession = await getAuthSession();
  if (!authSession?.user) return errorResponse("Unauthorized", 401);
  const userId = (authSession.user as any).id;

  const existing = await prisma.session.findUnique({ where: { id } });
  if (!existing) return errorResponse("Session not found", 404);
  if (existing.userId !== userId) return errorResponse("Only host can delete", 403);

  await prisma.session.delete({ where: { id } });
  return jsonResponse({ success: true });
}
