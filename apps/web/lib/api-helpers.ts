import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "skatespot-dev-secret"
);

export async function getAuthSession() {
  // Try Bearer token first (mobile)
  const headersList = await headers();
  const authHeader = headersList.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    try {
      const token = authHeader.slice(7);
      const { payload } = await jwtVerify(token, JWT_SECRET);
      return {
        user: {
          id: payload.id as string,
          name: payload.name as string,
          email: payload.email as string,
          username: payload.username as string,
          tier: payload.tier as string,
          points: payload.points as number,
        },
      };
    } catch {
      return null;
    }
  }

  // Fall back to NextAuth session (web)
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
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { crewMemberships: true },
  });
  if (!user) return;

  const newPoints = user.points + amount;
  const newTier = calculateTier(newPoints);

  await prisma.user.update({
    where: { id: userId },
    data: { points: newPoints, tier: newTier },
  });

  // Propagate points to user's crews
  for (const membership of user.crewMemberships) {
    await prisma.crew.update({
      where: { id: membership.crewId },
      data: { totalPoints: { increment: amount } },
    });
  }
}

export async function createNotification(
  userId: string,
  sourceUserId: string,
  type: string,
  resourceId?: string
) {
  if (userId === sourceUserId) return;
  await prisma.notification.create({
    data: {
      userId,
      sourceUserId,
      type,
      resourceId: resourceId || "",
    },
  });
}

export async function createActivityEvent(
  userId: string,
  type: string,
  resourceId: string,
  metadata: Record<string, any> = {}
) {
  await prisma.activityEvent.create({
    data: {
      userId,
      type,
      resourceId,
      metadata: JSON.stringify(metadata),
    },
  });
}
