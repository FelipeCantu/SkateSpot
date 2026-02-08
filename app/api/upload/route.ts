import { NextRequest } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getAuthSession, jsonResponse, errorResponse } from "@/lib/api-helpers";

export async function POST(req: NextRequest) {
  const session = await getAuthSession();
  if (!session?.user) return errorResponse("Unauthorized", 401);

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) return errorResponse("No file provided");

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Determine type and directory
  const isVideo = file.type.startsWith("video/");
  const subDir = isVideo ? "videos" : "images";
  const ext = file.name.split(".").pop() || (isVideo ? "mp4" : "jpg");
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const uploadDir = path.join(process.cwd(), "public", "uploads", subDir);
  await mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, filename);
  await writeFile(filePath, buffer);

  const url = `/uploads/${subDir}/${filename}`;

  return jsonResponse({ url, filename, type: isVideo ? "video" : "image" }, 201);
}
