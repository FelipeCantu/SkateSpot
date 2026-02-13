import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: spotId } = await params;

  const podium = await prisma.podiumBadge.findMany({
    where: { spotId },
    include: {
      user: { select: { id: true, username: true, name: true, avatar: true, tier: true } },
      clip: {
        select: {
          id: true,
          url: true,
          thumbnail: true,
          description: true,
          trickName: true,
          _count: { select: { likes: true } },
        },
      },
    },
    orderBy: { position: "asc" },
  });

  return jsonResponse(podium);
}
