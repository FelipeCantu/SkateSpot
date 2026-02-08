import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getAuthSession,
  jsonResponse,
  errorResponse,
  addPointsToUser,
} from "@/lib/api-helpers";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const spotId = searchParams.get("spotId");
  const userId = searchParams.get("userId");
  const sort = searchParams.get("sort") || "recent";
  const take = parseInt(searchParams.get("take") || "20");
  const skip = parseInt(searchParams.get("skip") || "0");

  const where: any = {};
  if (spotId) where.spotId = spotId;
  if (userId) where.userId = userId;

  const orderBy: any =
    sort === "popular" ? { likes: { _count: "desc" } } : { createdAt: "desc" };

  const session = await getAuthSession();

  const clips = await prisma.clip.findMany({
    where,
    include: {
      user: { select: { id: true, username: true, name: true, avatar: true } },
      spot: { select: { id: true, name: true } },
      _count: { select: { likes: true, comments: true } },
      likes: session?.user ? { where: { userId: session.user.id } } : false,
    },
    orderBy,
    take,
    skip,
  });

  const formatted = clips.map((c) => ({
    id: c.id,
    url: c.url,
    thumbnail: c.thumbnail,
    description: c.description,
    trickName: c.trickName,
    type: c.type,
    views: c.views,
    userId: c.userId,
    user: c.user,
    spotId: c.spotId,
    spot: c.spot,
    likes: c._count.likes,
    comments: c._count.comments,
    isLiked: session?.user ? c.likes.length > 0 : false,
    createdAt: c.createdAt.getTime(),
  }));

  return jsonResponse(formatted);
}

export async function POST(req: NextRequest) {
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);

  const body = await req.json();
  const { spotId, url, thumbnail, description, trickName, type } = body;

  if (!spotId || !url) return errorResponse("spotId and url are required");

  const spot = await prisma.spot.findUnique({ where: { id: spotId } });
  if (!spot) return errorResponse("Spot not found", 404);

  const clip = await prisma.clip.create({
    data: {
      url,
      thumbnail: thumbnail || "",
      description: description || "",
      trickName: trickName || "",
      type: type || "video",
      userId: session.user.id,
      spotId,
    },
    include: {
      user: { select: { id: true, username: true, name: true, avatar: true } },
      spot: { select: { id: true, name: true } },
    },
  });

  await addPointsToUser(session.user.id, 50);

  return jsonResponse(
    {
      id: clip.id,
      url: clip.url,
      thumbnail: clip.thumbnail,
      description: clip.description,
      trickName: clip.trickName,
      type: clip.type,
      views: 0,
      userId: clip.userId,
      user: clip.user,
      spotId: clip.spotId,
      spot: clip.spot,
      likes: 0,
      comments: 0,
      isLiked: false,
      createdAt: clip.createdAt.getTime(),
    },
    201
  );
}
