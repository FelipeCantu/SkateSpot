import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession, jsonResponse, errorResponse, addPointsToUser, createActivityEvent } from "@/lib/api-helpers";
import { checkAndAwardAchievements } from "@/lib/achievements";

export async function GET(req: NextRequest) {
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);
  const userId = (session.user as any).id;

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50")));
  const skip = (page - 1) * limit;
  const category = searchParams.get("category");

  const where: any = { userId };
  if (category) where.category = category;

  const [tricks, total] = await Promise.all([
    prisma.trickLog.findMany({
      where,
      include: {
        clip: { select: { id: true, thumbnail: true, url: true } },
      },
      orderBy: { landedAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.trickLog.count({ where }),
  ]);

  return jsonResponse({ data: tricks, total, page, limit, hasMore: skip + limit < total });
}

export async function POST(req: NextRequest) {
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);
  const userId = (session.user as any).id;

  const { trickName, category, clipId, notes } = await req.json();
  if (!trickName) return errorResponse("trickName required");

  // Check if already logged
  const existing = await prisma.trickLog.findUnique({
    where: { userId_trickName: { userId, trickName } },
  });
  if (existing) return errorResponse("Trick already logged");

  const trick = await prisma.trickLog.create({
    data: {
      userId,
      trickName,
      category: category || "other",
      clipId: clipId || null,
      notes: notes || "",
    },
  });

  await addPointsToUser(userId, 15);
  await createActivityEvent(userId, "trick_landed", trick.id, { trickName });

  // Check for achievements
  await checkAndAwardAchievements(userId);

  return jsonResponse(trick, 201);
}
