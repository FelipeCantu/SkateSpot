import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession, jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const setup = await prisma.gearSetup.findUnique({ where: { id } });
  if (!setup) return errorResponse("Gear setup not found", 404);
  return jsonResponse({ ...setup, photos: JSON.parse(setup.photos) });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);
  const userId = (session.user as any).id;

  const setup = await prisma.gearSetup.findUnique({ where: { id } });
  if (!setup) return errorResponse("Gear setup not found", 404);
  if (setup.userId !== userId) return errorResponse("Not authorized", 403);

  const body = await req.json();
  const updated = await prisma.gearSetup.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.deckBrand !== undefined && { deckBrand: body.deckBrand }),
      ...(body.deckSize !== undefined && { deckSize: body.deckSize }),
      ...(body.trucksBrand !== undefined && { trucksBrand: body.trucksBrand }),
      ...(body.wheelsBrand !== undefined && { wheelsBrand: body.wheelsBrand }),
      ...(body.wheelsSize !== undefined && { wheelsSize: body.wheelsSize }),
      ...(body.bearingsBrand !== undefined && { bearingsBrand: body.bearingsBrand }),
      ...(body.shoesBrand !== undefined && { shoesBrand: body.shoesBrand }),
      ...(body.photos !== undefined && { photos: JSON.stringify(body.photos) }),
    },
  });

  return jsonResponse({ ...updated, photos: JSON.parse(updated.photos) });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);
  const userId = (session.user as any).id;

  const setup = await prisma.gearSetup.findUnique({ where: { id } });
  if (!setup) return errorResponse("Gear setup not found", 404);
  if (setup.userId !== userId) return errorResponse("Not authorized", 403);

  await prisma.gearSetup.delete({ where: { id } });
  return jsonResponse({ success: true });
}
