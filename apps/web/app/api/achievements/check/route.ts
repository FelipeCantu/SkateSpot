import { NextRequest } from "next/server";
import { getAuthSession, jsonResponse, errorResponse } from "@/lib/api-helpers";
import { checkAndAwardAchievements } from "@/lib/achievements";

export async function POST() {
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);
  const userId = (session.user as any).id;

  const awarded = await checkAndAwardAchievements(userId);

  return jsonResponse({ awarded });
}
