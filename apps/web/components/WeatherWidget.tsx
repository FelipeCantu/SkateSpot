"use client";

import { useState, useEffect } from "react";
import { Cloud, Wind, Droplets, Thermometer } from "lucide-react";

interface WeatherWidgetProps {
  lat: number;
  lng: number;
  compact?: boolean;
}

const conditionIcons: Record<string, string> = {
  Clear: "☀️",
  Clouds: "☁️",
  Rain: "🌧️",
  Drizzle: "🌦️",
  Thunderstorm: "⛈️",
  Snow: "❄️",
  Mist: "🌫️",
  Fog: "🌫️",
  Haze: "🌫️",
};

export function WeatherWidget({ lat, lng, compact = false }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lat || !lng) return;
    fetch(`/api/weather?lat=${lat}&lng=${lng}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => setWeather(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [lat, lng]);

  if (loading) {
    return (
      <div className={`bg-neutral-900 border border-white/5 rounded-xl animate-pulse ${compact ? "p-3" : "p-4"}`}>
        <div className="h-6 w-24 bg-neutral-800 rounded" />
      </div>
    );
  }

  if (!weather) return null;

  const skateColor = weather.skateability > 70
    ? "text-green-400"
    : weather.skateability > 40
    ? "text-yellow-400"
    : "text-red-400";

  const skateBgColor = weather.skateability > 70
    ? "bg-green-500"
    : weather.skateability > 40
    ? "bg-yellow-500"
    : "bg-red-500";

  if (compact) {
    return (
      <div className="flex items-center gap-3 bg-neutral-900 border border-sky-500/10 rounded-lg px-3 py-2">
        <span className="text-lg">{conditionIcons[weather.condition] || "🌤️"}</span>
        <span className="text-sm font-medium text-white">{weather.temp}°C</span>
        <div className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${skateBgColor}`} />
          <span className={`text-xs font-medium ${skateColor}`}>{weather.skateability}%</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 border border-sky-500/10 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Cloud size={16} className="text-sky-400" />
        <h3 className="text-sm font-bold text-white">Weather</h3>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <span className="text-3xl">{conditionIcons[weather.condition] || "🌤️"}</span>
        <div>
          <div className="text-2xl font-bold text-white">{weather.temp}°C</div>
          <div className="text-xs text-neutral-400">{weather.condition}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div className="flex items-center gap-2 text-neutral-400">
          <Wind size={14} className="text-sky-400" />
          {weather.wind} km/h
        </div>
        <div className="flex items-center gap-2 text-neutral-400">
          <Droplets size={14} className="text-sky-400" />
          {weather.humidity}%
        </div>
      </div>

      {/* Skateability */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-neutral-400">Skateability</span>
          <span className={`text-sm font-bold ${skateColor}`}>{weather.skateability}%</span>
        </div>
        <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${skateBgColor}`}
            style={{ width: `${weather.skateability}%` }}
          />
        </div>
      </div>
    </div>
  );
}
