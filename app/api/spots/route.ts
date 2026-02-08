import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getAuthSession,
  jsonResponse,
  errorResponse,
  addPointsToUser,
} from "@/lib/api-helpers";

export async function GET() {
  const spots = await prisma.spot.findMany({
    include: {
      images: true,
      createdBy: { select: { id: true, username: true, name: true, avatar: true } },
      ratings: true,
      _count: { select: { clips: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const formatted = spots.map((s) => ({
    id: s.id,
    name: s.name,
    description: s.description,
    location: [s.lat, s.lng] as [number, number],
    difficulty: s.difficulty,
    type: s.type,
    rating:
      s.ratings.length > 0
        ? s.ratings.reduce((sum, r) => sum + r.value, 0) / s.ratings.length
        : 0,
    features: JSON.parse(s.features),
    images: s.images.map((i) => i.url),
    createdBy: s.createdBy.id,
    createdByUser: s.createdBy,
    createdAt: s.createdAt.getTime(),
    isVerified: s.isVerified,
    clipCount: s._count.clips,
  }));

  return jsonResponse(formatted);
}

export async function POST(req: NextRequest) {
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);

  const body = await req.json();
  const { name, description, location, difficulty, type, features, images } = body;

  if (!name || !location) return errorResponse("Name and location are required");

  const spot = await prisma.spot.create({
    data: {
      name,
      description: description || "",
      lat: location[0],
      lng: location[1],
      difficulty: difficulty || "Beginner",
      type: type || "Street",
      features: JSON.stringify(features || []),
      createdById: session.user.id,
      images: images?.length
        ? { create: images.map((url: string) => ({ url })) }
        : undefined,
    },
    include: { images: true },
  });

  await addPointsToUser(session.user.id, 25);

  return jsonResponse(
    {
      id: spot.id,
      name: spot.name,
      description: spot.description,
      location: [spot.lat, spot.lng],
      difficulty: spot.difficulty,
      type: spot.type,
      features: JSON.parse(spot.features),
      images: spot.images.map((i) => i.url),
      createdBy: session.user.id,
      createdAt: spot.createdAt.getTime(),
      isVerified: false,
      rating: 0,
      clipCount: 0,
    },
    201
  );
}
