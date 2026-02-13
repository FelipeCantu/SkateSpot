import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession, jsonResponse, errorResponse, addPointsToUser, createActivityEvent } from "@/lib/api-helpers";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const sort = searchParams.get("sort") || "points";

  const crews = await prisma.crew.findMany({
    include: {
      createdBy: { select: { id: true, username: true, name: true, avatar: true } },
      _count: { select: { members: true } },
    },
    orderBy: sort === "points" ? { totalPoints: "desc" } : { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  return jsonResponse(
    crews.map((c) => ({
      ...c,
      memberCount: c._count.members,
    }))
  );
}

export async function POST(req: NextRequest) {
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);
  const userId = (session.user as any).id;

  const { name, description, avatar } = await req.json();
  if (!name || name.length < 2) return errorResponse("Name must be at least 2 characters");

  const existing = await prisma.crew.findUnique({ where: { name } });
  if (existing) return errorResponse("Crew name already taken");

  const crew = await prisma.crew.create({
    data: {
      name,
      description: description || "",
      avatar: avatar || "",
      createdById: userId,
      members: {
        create: { userId, role: "owner" },
      },
    },
    include: {
      createdBy: { select: { id: true, username: true, name: true, avatar: true } },
      _count: { select: { members: true } },
    },
  });

  await addPointsToUser(userId, 50);
  await createActivityEvent(userId, "crew_joined", crew.id, { crewName: name, role: "owner" });

  return jsonResponse({ ...crew, memberCount: crew._count.members }, 201);
}
