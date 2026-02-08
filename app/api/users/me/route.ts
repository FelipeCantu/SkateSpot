import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession, jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      _count: { select: { followers: true, following: true, clips: true, spots: true } },
    },
  });

  if (!user) return errorResponse("User not found", 404);

  return jsonResponse({
    id: user.id,
    username: user.username,
    email: user.email,
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
    joinedAt: user.createdAt.getTime(),
  });
}

export async function PATCH(req: NextRequest) {
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);

  const body = await req.json();
  const { name, bio, location, avatar, socialLinks } = body;

  const data: any = {};
  if (name !== undefined) data.name = name;
  if (bio !== undefined) data.bio = bio;
  if (location !== undefined) data.location = location;
  if (avatar !== undefined) data.avatar = avatar;
  if (socialLinks?.instagram !== undefined)
    data.instagram = socialLinks.instagram;
  if (socialLinks?.youtube !== undefined) data.youtube = socialLinks.youtube;
  if (socialLinks?.tiktok !== undefined) data.tiktok = socialLinks.tiktok;

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data,
  });

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
  });
}
