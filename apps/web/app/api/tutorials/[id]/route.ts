import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession, jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const tutorial = await prisma.tutorial.update({
    where: { id },
    data: { views: { increment: 1 } },
    include: {
      user: { select: { id: true, username: true, name: true, avatar: true } },
      votes: { select: { helpful: true } },
    },
  });

  if (!tutorial) return errorResponse("Tutorial not found", 404);

  const helpfulVotes = tutorial.votes.filter((v) => v.helpful).length;
  const notHelpfulVotes = tutorial.votes.filter((v) => !v.helpful).length;

  return jsonResponse({
    ...tutorial,
    steps: JSON.parse(tutorial.steps),
    helpfulVotes,
    notHelpfulVotes,
    votes: undefined,
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);
  const userId = (session.user as any).id;

  const tutorial = await prisma.tutorial.findUnique({ where: { id } });
  if (!tutorial) return errorResponse("Tutorial not found", 404);
  if (tutorial.userId !== userId) return errorResponse("Not authorized", 403);

  const body = await req.json();
  const updated = await prisma.tutorial.update({
    where: { id },
    data: {
      ...(body.trickName !== undefined && { trickName: body.trickName }),
      ...(body.difficulty !== undefined && { difficulty: body.difficulty }),
      ...(body.videoUrl !== undefined && { videoUrl: body.videoUrl }),
      ...(body.thumbnail !== undefined && { thumbnail: body.thumbnail }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.steps !== undefined && { steps: JSON.stringify(body.steps) }),
    },
  });

  return jsonResponse({ ...updated, steps: JSON.parse(updated.steps) });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);
  const userId = (session.user as any).id;

  const tutorial = await prisma.tutorial.findUnique({ where: { id } });
  if (!tutorial) return errorResponse("Tutorial not found", 404);
  if (tutorial.userId !== userId) return errorResponse("Not authorized", 403);

  await prisma.tutorial.delete({ where: { id } });
  return jsonResponse({ success: true });
}
