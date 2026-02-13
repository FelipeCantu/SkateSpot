import { prisma } from "@/lib/prisma";
import { addPointsToUser, createActivityEvent } from "@/lib/api-helpers";
import { ACHIEVEMENT_DEFINITIONS } from "@skatespot/shared";
import { TRICKS } from "@skatespot/shared";

export async function checkAndAwardAchievements(userId: string): Promise<string[]> {
  const awarded: string[] = [];

  const existing = await prisma.achievement.findMany({
    where: { userId },
    select: { badgeKey: true },
  });
  const existingKeys = new Set(existing.map((a) => a.badgeKey));

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      _count: {
        select: {
          clips: true,
          spots: true,
          followers: true,
          trickLogs: true,
          crewMemberships: true,
          createdCrews: true,
        },
      },
    },
  });
  if (!user) return awarded;

  // Battle wins count
  const battleWins = await prisma.battle.count({
    where: {
      status: "completed",
      winnerId: { not: null },
      OR: [
        { clip1: { userId }, winnerId: { not: undefined } },
        { clip2: { userId }, winnerId: { not: undefined } },
      ],
    },
  });

  // Count battle wins more accurately
  const wonBattles = await prisma.battle.findMany({
    where: { status: "completed" },
    include: { clip1: true, clip2: true },
  });
  const actualBattleWins = wonBattles.filter(
    (b) =>
      (b.winnerId === b.clip1Id && b.clip1.userId === userId) ||
      (b.winnerId === b.clip2Id && b.clip2.userId === userId)
  ).length;

  // Unique spots with clips
  const uniqueSpotsWithClips = await prisma.clip.findMany({
    where: { userId },
    select: { spotId: true },
    distinct: ["spotId"],
  });

  // Gold podiums
  const goldPodiums = await prisma.podiumBadge.count({
    where: { userId, position: 1 },
  });

  // Trick logs by category
  const trickLogs = await prisma.trickLog.findMany({
    where: { userId },
    select: { trickName: true, category: true },
  });
  const trickNames = new Set(trickLogs.map((t) => t.trickName));

  // Challenge wins
  const challengeWins = await prisma.challenge.count({
    where: {
      status: "completed",
      challengerClip: { userId },
      winnerId: { not: null },
    },
  });

  const checks: Record<string, boolean> = {
    // Milestone
    first_clip: user._count.clips >= 1,
    clips_10: user._count.clips >= 10,
    clips_50: user._count.clips >= 50,
    first_spot: user._count.spots >= 1,
    spots_10: user._count.spots >= 10,
    spots_50: user._count.spots >= 50,

    // Activity
    explorer_10: uniqueSpotsWithClips.length >= 10,
    // night_owl and early_bird are checked at upload time
    night_owl: false,
    early_bird: false,
    streak_7: false, // Checked separately

    // Skill
    trick_10: user._count.trickLogs >= 10,
    trick_25: user._count.trickLogs >= 25,
    trick_50: user._count.trickLogs >= 50,
    all_flatground: TRICKS.flatground.every((t) => trickNames.has(t)),
    all_grinds: TRICKS.grinds.every((t) => trickNames.has(t)),

    // Social
    followers_10: user._count.followers >= 10,
    followers_100: user._count.followers >= 100,
    crew_founder: user._count.createdCrews >= 1,
    battle_winner_5: actualBattleWins >= 5,

    // Special
    first_blood: actualBattleWins >= 1,
    dethroned: challengeWins >= 1,
    underdog: false, // Checked at battle resolution
    triple_crown: goldPodiums >= 3,
    social_butterfly: user._count.crewMemberships >= 3,
    perfectionist: false, // Checked at rating time
  };

  for (const def of ACHIEVEMENT_DEFINITIONS) {
    if (existingKeys.has(def.key)) continue;
    if (checks[def.key]) {
      await prisma.achievement.create({
        data: { userId, badgeKey: def.key },
      });
      await addPointsToUser(userId, 25);
      await createActivityEvent(userId, "badge_earned", def.key, {
        name: def.name,
      });
      awarded.push(def.key);
    }
  }

  return awarded;
}

export async function checkTimeBasedAchievement(userId: string, uploadHour: number): Promise<string[]> {
  const awarded: string[] = [];

  if (uploadHour >= 0 && uploadHour < 5) {
    const existing = await prisma.achievement.findUnique({
      where: { userId_badgeKey: { userId, badgeKey: "night_owl" } },
    });
    if (!existing) {
      await prisma.achievement.create({
        data: { userId, badgeKey: "night_owl" },
      });
      await addPointsToUser(userId, 25);
      awarded.push("night_owl");
    }
  }

  if (uploadHour >= 5 && uploadHour < 7) {
    const existing = await prisma.achievement.findUnique({
      where: { userId_badgeKey: { userId, badgeKey: "early_bird" } },
    });
    if (!existing) {
      await prisma.achievement.create({
        data: { userId, badgeKey: "early_bird" },
      });
      await addPointsToUser(userId, 25);
      awarded.push("early_bird");
    }
  }

  return awarded;
}
