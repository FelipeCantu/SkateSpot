export interface WeatherData {
  temp: number;
  condition: string;
  icon: string;
  wind: number;
  humidity: number;
  skateability: number;
}

export function calculateSkateability(weather: {
  condition: string;
  wind: number;
  humidity: number;
  temp: number;
}): number {
  let score = 100;

  // Rain/snow penalties
  const condition = weather.condition.toLowerCase();
  if (condition.includes('rain') || condition.includes('drizzle')) score -= 60;
  if (condition.includes('snow') || condition.includes('sleet')) score -= 80;
  if (condition.includes('thunderstorm')) score -= 90;
  if (condition.includes('mist') || condition.includes('fog')) score -= 15;

  // Wind penalties
  if (weather.wind > 30) score -= 30;
  else if (weather.wind > 20) score -= 15;
  else if (weather.wind > 10) score -= 5;

  // Humidity penalties
  if (weather.humidity > 90) score -= 20;
  else if (weather.humidity > 75) score -= 10;

  // Temperature penalties
  if (weather.temp < 0) score -= 30;
  else if (weather.temp < 5) score -= 15;
  else if (weather.temp > 38) score -= 20;
  else if (weather.temp > 32) score -= 10;

  return Math.max(0, Math.min(100, score));
}
