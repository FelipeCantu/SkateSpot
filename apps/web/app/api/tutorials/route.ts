import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession, jsonResponse, errorResponse, addPointsToUser, createActivityEvent } from "@/lib/api-helpers";
import { POINTS } from "@skatespot/shared";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const difficulty = searchParams.get("difficulty");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "recent";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where: any = {};
  if (difficulty) where.difficulty = difficulty;
  if (search) {
    where.OR = [
      { trickName: { contains: search } },
      { description: { contains: search } },
    ];
  }

  const orderBy: any =
    sort === "popular" ? { views: "desc" } :
    sort === "helpful" ? { helpfulCount: "desc" } :
    { createdAt: "desc" };

  const tutorials = await prisma.tutorial.findMany({
    where,
    include: {
      user: { select: { id: true, username: true, name: true, avatar: true } },
      _count: { select: { votes: true } },
    },
    orderBy,
    skip: (page - 1) * limit,
    take: limit,
  });

  return jsonResponse(
    tutorials.map((t) => ({
      ...t,
      steps: JSON.parse(t.steps),
    }))
  );
}

export async function POST(req: NextRequest) {
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);
  const userId = (session.user as any).id;

  const { trickName, difficulty, videoUrl, thumbnail, description, steps } = await req.json();
  if (!trickName) return errorResponse("Trick name is required");

  const tutorial = await prisma.tutorial.create({
    data: {
      userId,
      trickName,
      difficulty: difficulty || "beginner",
      videoUrl: videoUrl || "",
      thumbnail: thumbnail || "",
      description: description || "",
      steps: JSON.stringify(steps || []),
    },
    include: {
      user: { select: { id: true, username: true, name: true, avatar: true } },
    },
  });

  await addPointsToUser(userId, POINTS.CREATE_TUTORIAL);
  await createActivityEvent(userId, "tutorial_created", tutorial.id, { trickName });

  return jsonResponse({ ...tutorial, steps: JSON.parse(tutorial.steps) }, 201);
}
