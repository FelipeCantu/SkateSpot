import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
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

  // Seed likes
  await prisma.like.createMany({
    data: [
      { userId: demo.id, clipId: clip1.id },
      { userId: sarah.id, clipId: clip1.id },
      { userId: alex.id, clipId: clip2.id },
    ],
  });

  // Seed comments
  await prisma.comment.createMany({
    data: [
      { userId: sarah.id, clipId: clip1.id, content: "That was clean! 🔥" },
      { userId: demo.id, clipId: clip1.id, content: "Sick kickflip dude!" },
    ],
  });

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
