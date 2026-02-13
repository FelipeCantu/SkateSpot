import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: userId } = await params;

  const tricks = await prisma.trickLog.findMany({
    where: { userId },
    orderBy: { landedAt: "desc" },
  });

  return jsonResponse(tricks);
}
