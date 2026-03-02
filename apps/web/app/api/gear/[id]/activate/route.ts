import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession, jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);
  const userId = (session.user as any).id;

  const setup = await prisma.gearSetup.findUnique({ where: { id } });
  if (!setup) return errorResponse("Gear setup not found", 404);
  if (setup.userId !== userId) return errorResponse("Not authorized", 403);

  await prisma.$transaction([
    prisma.gearSetup.updateMany({
      where: { userId, isActive: true },
      data: { isActive: false },
    }),
    prisma.gearSetup.update({
      where: { id },
      data: { isActive: true },
    }),
  ]);

  return jsonResponse({ success: true });
}
