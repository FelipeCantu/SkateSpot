import { NextRequest } from "next/server";
import { jsonResponse, errorResponse } from "@/lib/api-helpers";
import { calculateSkateability } from "@skatespot/shared";

// In-memory cache: key = "lat,lng" -> { data, timestamp }
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!lat || !lng) return errorResponse("lat and lng required");

  const cacheKey = `${parseFloat(lat).toFixed(2)},${parseFloat(lng).toFixed(2)}`;

  // Check cache
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return jsonResponse(cached.data);
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    // Graceful fallback - return mock data
    const fallback = {
      temp: 22,
      condition: "Clear",
      icon: "01d",
      wind: 8,
      humidity: 45,
      skateability: 90,
      isFallback: true,
    };
    return jsonResponse(fallback);
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) {
      return errorResponse("Failed to fetch weather data", 502);
    }

    const data = await res.json();
    const weather = {
      temp: Math.round(data.main.temp),
      condition: data.weather[0]?.main || "Unknown",
      icon: data.weather[0]?.icon || "01d",
      wind: Math.round(data.wind?.speed || 0),
      humidity: data.main?.humidity || 0,
      skateability: 0,
    };

    weather.skateability = calculateSkateability(weather);

    // Store in cache
    cache.set(cacheKey, { data: weather, timestamp: Date.now() });

    // Clean old cache entries
    for (const [key, value] of cache.entries()) {
      if (Date.now() - value.timestamp > CACHE_TTL) cache.delete(key);
    }

    return jsonResponse(weather);
  } catch {
    return errorResponse("Weather service unavailable", 503);
  }
}
