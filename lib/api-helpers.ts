import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getAuthSession() {
  const session = await auth();
  return session;
}

export function jsonResponse(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function calculateTier(points: number): string {
  if (points >= 1000) return "legend";
  if (points >= 500) return "pro";
  if (points >= 100) return "amateur";
  return "rookie";
}

export async function addPointsToUser(userId: string, amount: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;

  const newPoints = user.points + amount;
  const newTier = calculateTier(newPoints);

  await prisma.user.update({
    where: { id: userId },
    data: { points: newPoints, tier: newTier },
  });
}

export async function createNotification(
  userId: string,
  sourceUserId: string,
  type: string,
  resourceId?: string
) {
  if (userId === sourceUserId) return; // Don't notify yourself
  await prisma.notification.create({
    data: {
      userId,
      sourceUserId,
      type,
      resourceId: resourceId || "",
    },
  });
}
