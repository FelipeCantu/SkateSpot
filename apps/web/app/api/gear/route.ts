import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession, jsonResponse, errorResponse, addPointsToUser, createActivityEvent } from "@/lib/api-helpers";
import { POINTS } from "@skatespot/shared";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    const session = await getAuthSession();
    if (!session?.user) return errorResponse("Unauthorized", 401);
    const setups = await prisma.gearSetup.findMany({
      where: { userId: (session.user as any).id },
      orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
    });
    return jsonResponse(setups.map((s) => ({ ...s, photos: JSON.parse(s.photos) })));
  }

  const setups = await prisma.gearSetup.findMany({
    where: { userId },
    orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
  });
  return jsonResponse(setups.map((s) => ({ ...s, photos: JSON.parse(s.photos) })));
}

export async function POST(req: NextRequest) {
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);
  const userId = (session.user as any).id;

  const body = await req.json();
  const { name, deckBrand, deckSize, trucksBrand, wheelsBrand, wheelsSize, bearingsBrand, shoesBrand, photos } = body;

  if (!name) return errorResponse("Name is required");

  const existingCount = await prisma.gearSetup.count({ where: { userId } });

  const setup = await prisma.gearSetup.create({
    data: {
      userId,
      name,
      deckBrand: deckBrand || "",
      deckSize: deckSize || "",
      trucksBrand: trucksBrand || "",
      wheelsBrand: wheelsBrand || "",
      wheelsSize: wheelsSize || "",
      bearingsBrand: bearingsBrand || "",
      shoesBrand: shoesBrand || "",
      photos: JSON.stringify(photos || []),
      isActive: existingCount === 0,
    },
  });

  if (existingCount === 0) {
    await addPointsToUser(userId, POINTS.FIRST_GEAR_SETUP);
    await createActivityEvent(userId, "gear_setup_created", setup.id, { name });
  }

  return jsonResponse({ ...setup, photos: JSON.parse(setup.photos) }, 201);
}
