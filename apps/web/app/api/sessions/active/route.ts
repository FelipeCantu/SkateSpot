import { prisma } from "@/lib/prisma";
import { jsonResponse } from "@/lib/api-helpers";

export async function GET() {
  const sessions = await prisma.session.findMany({
    where: { status: "active" },
    include: {
      user: { select: { id: true, username: true, name: true, avatar: true } },
      spot: { select: { id: true, name: true, lat: true, lng: true } },
      _count: { select: { participants: true } },
    },
    orderBy: { startTime: "desc" },
    take: 50,
  });

  return jsonResponse(
    sessions.map((s) => ({
      ...s,
      participantCount: s._count.participants,
    }))
  );
}
