import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: crewId } = await params;

  const members = await prisma.crewMember.findMany({
    where: { crewId },
    include: {
      user: { select: { id: true, username: true, name: true, avatar: true, points: true, tier: true } },
    },
    orderBy: { joinedAt: "asc" },
  });

  return jsonResponse(members);
}
