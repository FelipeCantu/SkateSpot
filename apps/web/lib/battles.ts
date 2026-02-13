import { prisma } from "@/lib/prisma";
import { addPointsToUser, createNotification, createActivityEvent } from "@/lib/api-helpers";
import { BATTLE_AUTO_TRIGGER_LIKES, BATTLE_DURATION_HOURS } from "@skatespot/shared";

export async function shouldTriggerBattle(clipId: string): Promise<boolean> {
  const clip = await prisma.clip.findUnique({
    where: { id: clipId },
    include: { likes: true },
  });
  if (!clip) return false;

  if (clip.likes.length < BATTLE_AUTO_TRIGGER_LIKES) return false;

  // Check if clip is already in an active battle
  const existingBattle = await prisma.battle.findFirst({
    where: {
      status: "active",
      OR: [{ clip1Id: clipId }, { clip2Id: clipId }],
    },
  });
  if (existingBattle) return false;

  // Find another top clip at same spot not already in battle
  const otherClip = await prisma.clip.findFirst({
    where: {
      spotId: clip.spotId,
      id: { not: clipId },
      battlesAsClip1: { none: { status: "active" } },
      battlesAsClip2: { none: { status: "active" } },
    },
    include: { likes: true },
    orderBy: { likes: { _count: "desc" } },
  });

  if (!otherClip || otherClip.likes.length < Math.floor(BATTLE_AUTO_TRIGGER_LIKES / 2)) {
    return false;
  }

  // Create the battle
  const expiresAt = new Date(Date.now() + BATTLE_DURATION_HOURS * 60 * 60 * 1000);
  const battle = await prisma.battle.create({
    data: {
      spotId: clip.spotId,
      clip1Id: clipId,
      clip2Id: otherClip.id,
      expiresAt,
    },
  });

  // Notify both clip owners
  await createNotification(clip.userId, otherClip.userId, "battle_invite", battle.id);
  await createNotification(otherClip.userId, clip.userId, "battle_invite", battle.id);

  return true;
}

export async function resolveBattle(battleId: string) {
  const battle = await prisma.battle.findUnique({
    where: { id: battleId },
    include: { clip1: true, clip2: true },
  });
  if (!battle || battle.status !== "active") return null;

  let winnerId: string | null = null;
  let winnerClipUserId: string | null = null;
  let loserClipUserId: string | null = null;

  if (battle.clip1Votes > battle.clip2Votes) {
    winnerId = battle.clip1Id;
    winnerClipUserId = battle.clip1.userId;
    loserClipUserId = battle.clip2.userId;
  } else if (battle.clip2Votes > battle.clip1Votes) {
    winnerId = battle.clip2Id;
    winnerClipUserId = battle.clip2.userId;
    loserClipUserId = battle.clip1.userId;
  }
  // If tied, no winner

  await prisma.battle.update({
    where: { id: battleId },
    data: { status: "completed", winnerId },
  });

  if (winnerClipUserId) {
    await addPointsToUser(winnerClipUserId, 100);
    await createNotification(winnerClipUserId, loserClipUserId!, "battle_result", battleId);
    await createNotification(loserClipUserId!, winnerClipUserId, "battle_result", battleId);
    await createActivityEvent(winnerClipUserId, "battle_win", battleId, {
      spotId: battle.spotId,
    });

    // Recalculate podium after battle
    await recalculatePodium(battle.spotId);
  }

  return { winnerId, winnerClipUserId };
}

export async function recalculatePodium(spotId: string) {
  // Get top 3 clips at this spot by like count
  const topClips = await prisma.clip.findMany({
    where: { spotId },
    include: { _count: { select: { likes: true } } },
    orderBy: { likes: { _count: "desc" } },
    take: 3,
  });

  // Delete existing podium for this spot
  await prisma.podiumBadge.deleteMany({ where: { spotId } });

  // Create new podium entries
  for (let i = 0; i < topClips.length; i++) {
    const clip = topClips[i];
    if (clip._count.likes === 0) continue;

    await prisma.podiumBadge.create({
      data: {
        spotId,
        userId: clip.userId,
        clipId: clip.id,
        position: i + 1,
      },
    });

    if (i === 0) {
      await createActivityEvent(clip.userId, "podium_earned", spotId, {
        position: 1,
        spotId,
      });
    }
  }
}
