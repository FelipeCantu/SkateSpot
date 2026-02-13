import { NextRequest } from "next/server";
import { compareSync } from "bcryptjs";
import { SignJWT } from "jose";
import { prisma } from "@/lib/prisma";
import { jsonResponse, errorResponse } from "@/lib/api-helpers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "skatespot-dev-secret"
);

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return errorResponse("Email and password required", 400);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return errorResponse("Invalid credentials", 401);

  const isValid = compareSync(password, user.passwordHash);
  if (!isValid) return errorResponse("Invalid credentials", 401);

  const token = await new SignJWT({
    id: user.id,
    name: user.name,
    email: user.email,
    username: user.username,
    tier: user.tier,
    points: user.points,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(JWT_SECRET);

  return jsonResponse({
    token,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      tier: user.tier,
      points: user.points,
    },
  });
}
