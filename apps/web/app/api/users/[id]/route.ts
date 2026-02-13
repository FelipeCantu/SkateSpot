import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession, jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getAuthSession();

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      _count: { select: { followers: true, following: true, clips: true, spots: true } },
      followers: session?.user
        ? { where: { followerId: session.user.id } }
        : false,
    },
  });

  if (!user) return errorResponse("User not found", 404);

  return jsonResponse({
    id: user.id,
    username: user.username,
    name: user.name,
    avatar: user.avatar,
    bio: user.bio,
    points: user.points,
    tier: user.tier,
    location: user.location,
    socialLinks: {
      instagram: user.instagram || undefined,
      youtube: user.youtube || undefined,
      tiktok: user.tiktok || undefined,
    },
    followers: user._count.followers,
    following: user._count.following,
    clipCount: user._count.clips,
    spotCount: user._count.spots,
    isFollowing: session?.user ? user.followers.length > 0 : false,
    joinedAt: user.createdAt.getTime(),
  });
}
