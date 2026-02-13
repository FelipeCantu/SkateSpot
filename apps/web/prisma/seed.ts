import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Clear V2 data first (depends on V1)
  await prisma.activityEvent.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.trickLog.deleteMany();
  await prisma.crewMember.deleteMany();
  await prisma.crew.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversationParticipant.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.podiumBadge.deleteMany();
  await prisma.challengeVote.deleteMany();
  await prisma.challenge.deleteMany();
  await prisma.battleVote.deleteMany();
  await prisma.battle.deleteMany();

  // Clear V1 data
  await prisma.notification.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.like.deleteMany();
  await prisma.save.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.clip.deleteMany();
  await prisma.spotImage.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.spot.deleteMany();
  await prisma.user.deleteMany();

  const password = hashSync("password123", 10);

  // Seed users
  const demo = await prisma.user.create({
    data: {
      id: "user_demo",
      username: "demo",
      email: "demo@skatespot.com",
      passwordHash: password,
      name: "Demo Skater",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Demo",
      bio: "Just a demo account checking out all the spots.",
      points: 150,
      tier: "amateur",
      location: "London, UK",
    },
  });

  const alex = await prisma.user.create({
    data: {
      id: "user_alex",
      username: "skate_alex",
      email: "alex@skatespot.com",
      passwordHash: password,
      name: "Alex Rivera",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      bio: "Street skating is life. Always hunting for new spots.",
      points: 1250,
      tier: "legend",
      location: "London, UK",
      instagram: "alexrivera",
    },
  });

  const sarah = await prisma.user.create({
    data: {
      id: "user_sarah",
      username: "sarahshreds",
      email: "sarah@skatespot.com",
      passwordHash: password,
      name: "Sarah Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      bio: "Transition queen. Bowl sessions every weekend.",
      points: 980,
      tier: "pro",
      location: "London, UK",
      youtube: "sarahshreds",
    },
  });

  const mike = await prisma.user.create({
    data: {
      id: "user_mike",
      username: "mike_v",
      email: "mike@skatespot.com",
      passwordHash: password,
      name: "Mike V",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
      bio: "Old school skater. DIY spots are the best.",
      points: 750,
      tier: "pro",
      location: "London, UK",
    },
  });

  // Seed follows
  await prisma.follow.createMany({
    data: [
      { followerId: demo.id, followingId: alex.id },
      { followerId: sarah.id, followingId: alex.id },
      { followerId: mike.id, followingId: alex.id },
      { followerId: alex.id, followingId: sarah.id },
      { followerId: demo.id, followingId: sarah.id },
    ],
  });

  // Seed spots
  const southbank = await prisma.spot.create({
    data: {
      id: "spot_southbank",
      name: "Southbank Centre",
      description: "Iconic undercroft skate spot. Ledges, banks, and stairs.",
      lat: 51.506,
      lng: -0.117,
      difficulty: "Pro",
      type: "Street",
      features: JSON.stringify(["Ledge", "Stairs", "Bank"]),
      isVerified: true,
      createdById: alex.id,
    },
  });

  const hydePark = await prisma.spot.create({
    data: {
      id: "spot_hydepark",
      name: "Hyde Park",
      description: "Smooth paths and open spaces, perfect for cruising.",
      lat: 51.507,
      lng: -0.165,
      difficulty: "Beginner",
      type: "Park",
      features: JSON.stringify(["Flatground", "Path"]),
      isVerified: true,
      createdById: sarah.id,
    },
  });

  const stockwell = await prisma.spot.create({
    data: {
      id: "spot_stockwell",
      name: "Stockwell Skatepark",
      description: "Legendary concrete park aka Brixton Beach.",
      lat: 51.472,
      lng: -0.122,
      difficulty: "Intermediate",
      type: "Transition",
      features: JSON.stringify(["Bowl", "Snake Run", "Hips"]),
      isVerified: true,
      createdById: mike.id,
    },
  });

  // Seed spot images
  await prisma.spotImage.createMany({
    data: [
      { spotId: southbank.id, url: "https://images.unsplash.com/photo-1564982752979-3f7bc974d29a?q=80&w=800" },
      { spotId: hydePark.id, url: "https://images.unsplash.com/photo-1520045864914-699830d6e1ef?q=80&w=800" },
      { spotId: stockwell.id, url: "https://images.unsplash.com/photo-1564982752979-3f7bc974d29a?q=80&w=800" },
    ],
  });

  // Seed spot ratings
  await prisma.rating.createMany({
    data: [
      { userId: alex.id, spotId: southbank.id, value: 5 },
      { userId: sarah.id, spotId: southbank.id, value: 5 },
      { userId: demo.id, spotId: hydePark.id, value: 4 },
      { userId: mike.id, spotId: stockwell.id, value: 5 },
      { userId: sarah.id, spotId: stockwell.id, value: 5 },
    ],
  });

  // Seed clips
  const clip1 = await prisma.clip.create({
    data: {
      id: "clip_1",
      url: "/uploads/videos/placeholder.mp4",
      thumbnail: "https://images.unsplash.com/photo-1564982752979-3f7bc974d29a?q=80&w=600",
      description: "Finally landed the kickflip down the 5 stair!",
      trickName: "Kickflip",
      type: "video",
      views: 1243,
      userId: alex.id,
      spotId: southbank.id,
    },
  });

  const clip2 = await prisma.clip.create({
    data: {
      id: "clip_2",
      url: "/uploads/videos/placeholder2.mp4",
      thumbnail: "https://images.unsplash.com/photo-1520045864914-699830d6e1ef?q=80&w=600",
      description: "Golden hour sessions are unmatched.",
      trickName: "Cruising",
      type: "image",
      views: 856,
      userId: sarah.id,
      spotId: hydePark.id,
    },
  });

  const clip3 = await prisma.clip.create({
    data: {
      id: "clip_3",
      url: "/uploads/videos/placeholder3.mp4",
      thumbnail: "https://images.unsplash.com/photo-1564982752979-3f7bc974d29a?q=80&w=600",
      description: "Bowl session at Stockwell!",
      trickName: "Frontside Air",
      type: "video",
      views: 432,
      userId: mike.id,
      spotId: stockwell.id,
    },
  });

  // Seed likes
  await prisma.like.createMany({
    data: [
      { userId: demo.id, clipId: clip1.id },
      { userId: sarah.id, clipId: clip1.id },
      { userId: mike.id, clipId: clip1.id },
      { userId: alex.id, clipId: clip2.id },
      { userId: demo.id, clipId: clip2.id },
      { userId: alex.id, clipId: clip3.id },
    ],
  });

  // Seed comments
  await prisma.comment.createMany({
    data: [
      { userId: sarah.id, clipId: clip1.id, content: "That was clean!" },
      { userId: demo.id, clipId: clip1.id, content: "Sick kickflip dude!" },
    ],
  });

  // ==================== V2 Seed Data ====================

  // Seed a crew
  const crew = await prisma.crew.create({
    data: {
      id: "crew_nightshredders",
      name: "Night Shredders",
      description: "We skate when the sun goes down.",
      createdById: alex.id,
      totalPoints: alex.points + sarah.points,
      members: {
        create: [
          { userId: alex.id, role: "owner" },
          { userId: sarah.id, role: "member" },
        ],
      },
    },
  });

  // Seed a battle
  const battle = await prisma.battle.create({
    data: {
      id: "battle_1",
      spotId: southbank.id,
      clip1Id: clip1.id,
      clip2Id: clip3.id,
      clip1Votes: 5,
      clip2Votes: 3,
      status: "completed",
      winnerId: clip1.id,
      expiresAt: new Date(Date.now() - 86400000),
    },
  });

  // Seed trick logs
  await prisma.trickLog.createMany({
    data: [
      { userId: alex.id, trickName: "Kickflip", category: "flatground", clipId: clip1.id },
      { userId: alex.id, trickName: "Ollie", category: "flatground" },
      { userId: alex.id, trickName: "Heelflip", category: "flatground" },
      { userId: sarah.id, trickName: "Frontside Air", category: "aerials" },
      { userId: sarah.id, trickName: "Rock to Fakie", category: "transition" },
      { userId: mike.id, trickName: "50-50", category: "grinds" },
    ],
  });

  // Seed achievements
  await prisma.achievement.createMany({
    data: [
      { userId: alex.id, badgeKey: "first_clip" },
      { userId: alex.id, badgeKey: "first_spot" },
      { userId: alex.id, badgeKey: "first_blood" },
      { userId: alex.id, badgeKey: "crew_founder" },
      { userId: sarah.id, badgeKey: "first_clip" },
      { userId: sarah.id, badgeKey: "first_spot" },
    ],
  });

  // Seed podium
  await prisma.podiumBadge.createMany({
    data: [
      { spotId: southbank.id, userId: alex.id, clipId: clip1.id, position: 1 },
    ],
  });

  // Seed activity events
  await prisma.activityEvent.createMany({
    data: [
      { userId: alex.id, type: "clip_upload", resourceId: clip1.id, metadata: JSON.stringify({ trickName: "Kickflip" }) },
      { userId: sarah.id, type: "clip_upload", resourceId: clip2.id, metadata: JSON.stringify({ trickName: "Cruising" }) },
      { userId: mike.id, type: "clip_upload", resourceId: clip3.id, metadata: JSON.stringify({ trickName: "Frontside Air" }) },
      { userId: alex.id, type: "battle_win", resourceId: battle.id, metadata: JSON.stringify({ spotId: southbank.id }) },
      { userId: alex.id, type: "crew_joined", resourceId: crew.id, metadata: JSON.stringify({ crewName: "Night Shredders" }) },
      { userId: alex.id, type: "badge_earned", resourceId: "first_blood", metadata: JSON.stringify({ name: "First Blood" }) },
    ],
  });

  // Seed a conversation
  const conv = await prisma.conversation.create({
    data: {
      participants: {
        create: [
          { userId: alex.id },
          { userId: sarah.id },
        ],
      },
      messages: {
        create: [
          { senderId: alex.id, content: "Yo, session at Southbank tonight?" },
          { senderId: sarah.id, content: "For sure! What time?" },
          { senderId: alex.id, content: "8pm, bring your camera" },
        ],
      },
    },
  });

  console.log("V2 seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
