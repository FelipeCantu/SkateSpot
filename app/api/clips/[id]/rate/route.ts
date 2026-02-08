import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession, jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);

  const { id } = await params;
  const { value } = await req.json();

  if (!value || value < 1 || value > 5)
    return errorResponse("Rating must be between 1 and 5");

  const clip = await prisma.clip.findUnique({ where: { id } });
  if (!clip) return errorResponse("Clip not found", 404);

  await prisma.rating.upsert({
    where: { userId_clipId: { userId: session.user.id, clipId: id } },
    update: { value },
    create: { userId: session.user.id, clipId: id, value },
  });

  const ratings = await prisma.rating.findMany({ where: { clipId: id } });
  const avg = ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length;

  return jsonResponse({ rating: avg, count: ratings.length });
}
