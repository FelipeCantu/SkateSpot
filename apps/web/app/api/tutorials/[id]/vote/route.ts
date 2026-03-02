import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession, jsonResponse, errorResponse, addPointsToUser, createNotification } from "@/lib/api-helpers";
import { POINTS } from "@skatespot/shared";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);
  const userId = (session.user as any).id;

  const { helpful } = await req.json();
  if (typeof helpful !== "boolean") return errorResponse("helpful must be a boolean");

  const tutorial = await prisma.tutorial.findUnique({ where: { id } });
  if (!tutorial) return errorResponse("Tutorial not found", 404);

  const existing = await prisma.tutorialVote.findUnique({
    where: { tutorialId_userId: { tutorialId: id, userId } },
  });

  if (existing) {
    if (existing.helpful === helpful) {
      // Remove vote
      await prisma.tutorialVote.delete({ where: { id: existing.id } });
      if (existing.helpful) {
        await prisma.tutorial.update({
          where: { id },
          data: { helpfulCount: { decrement: 1 } },
        });
      }
      return jsonResponse({ voted: false });
    }
    // Update vote
    await prisma.tutorialVote.update({
      where: { id: existing.id },
      data: { helpful },
    });
    await prisma.tutorial.update({
      where: { id },
      data: { helpfulCount: helpful ? { increment: 1 } : { decrement: 1 } },
    });
  } else {
    // New vote
    await prisma.tutorialVote.create({
      data: { tutorialId: id, userId, helpful },
    });
    if (helpful) {
      await prisma.tutorial.update({
        where: { id },
        data: { helpfulCount: { increment: 1 } },
      });
      await addPointsToUser(tutorial.userId, POINTS.TUTORIAL_HELPFUL_VOTE);
      await createNotification(tutorial.userId, userId, "tutorial_helpful", id);
    }
  }

  return jsonResponse({ voted: true, helpful });
}
