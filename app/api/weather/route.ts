import { NextRequest, NextResponse } from "next/server";

// OpenWeatherMap API integration
// Get your free API key at: https://openweathermap.org/api

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get("lat") || "38.58";
  const lon = searchParams.get("lon") || "-121.49";

  const apiKey = process.env.OPENWEATHERMAP_API_KEY;

  // If no API key, return mock data for development
  if (!apiKey) {
    console.log("[v0] No OpenWeatherMap API key found, returning mock data");
    return NextResponse.json({
      temperature: 24.5,
      humidity: 62,
      precipitation: 12.4,
      windSpeed: 14,
      windDirection: "NE",
      uvIndex: 8.2,
      condition: "Partly Cloudy",
      location: "Sacramento, CA",
      forecast: [
        { day: "Mon", temp: 24, condition: "sunny" },
        { day: "Tue", temp: 22, condition: "cloudy" },
        { day: "Wed", temp: 19, condition: "rainy" },
        { day: "Thu", temp: 25, condition: "sunny" },
        { day: "Fri", temp: 26, condition: "cloudy" },
        { day: "Sat", temp: 28, condition: "sunny" },
        { day: "Sun", temp: 27, condition: "partly_cloudy" },
      ],
    });
  }

  try {
    // Current weather data
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const weatherResponse = await fetch(weatherUrl, {
      next: { revalidate: 300 },
    });

    if (!weatherResponse.ok) {
      throw new Error("Failed to fetch weather data");
    }

    const weatherData = await weatherResponse.json();

    // UV Index (separate endpoint)
    const uvUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    let uvIndex = 5; // default value
    try {
      const uvResponse = await fetch(uvUrl, { next: { revalidate: 300 } });
      if (uvResponse.ok) {
        const uvData = await uvResponse.json();
        uvIndex = uvData.value;
      }
    } catch {
      console.log("[v0] UV index fetch failed, using default");
    }

    // 7-day forecast
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    let forecast: Array<{ day: string; temp: number; condition: string }> = [];

    try {
      const forecastResponse = await fetch(forecastUrl, {
        next: { revalidate: 300 },
      });
      if (forecastResponse.ok) {
        const forecastData = await forecastResponse.json();
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        // Get daily forecasts (every 8th entry is ~24h apart)
        forecast = forecastData.list
          .filter((_: unknown, index: number) => index % 8 === 0)
          .slice(0, 7)
          .map(
            (item: {
              dt: number;
              main: { temp: number };
              weather: Array<{ main: string }>;
            }) => ({
              day: days[new Date(item.dt * 1000).getDay()],
              temp: Math.round(item.main.temp),
              condition: item.weather[0].main.toLowerCase(),
            }),
          );
      }
    } catch {
      console.log("[v0] Forecast fetch failed");
    }

    // Map weather condition codes
    const getCondition = (code: number) => {
      if (code >= 200 && code < 300) return "Thunderstorm";
      if (code >= 300 && code < 400) return "Drizzle";
      if (code >= 500 && code < 600) return "Rain";
      if (code >= 600 && code < 700) return "Snow";
      if (code >= 700 && code < 800) return "Mist";
      if (code === 800) return "Clear";
      if (code > 800) return "Cloudy";
      return "Unknown";
    };

    // Get wind direction from degrees
    const getWindDirection = (degrees: number) => {
      const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
      const index = Math.round(degrees / 45) % 8;
      return directions[index];
    };

    return NextResponse.json({
      temperature: Math.round(weatherData.main.temp * 10) / 10,
      humidity: weatherData.main.humidity,
      precipitation: weatherData.rain?.["1h"] || weatherData.rain?.["3h"] || 0,
      windSpeed: Math.round(weatherData.wind.speed * 3.6), // Convert m/s to km/h
      windDirection: getWindDirection(weatherData.wind.deg),
      uvIndex: Math.round(uvIndex * 10) / 10,
      condition: getCondition(weatherData.weather[0].id),
      location: `${weatherData.name}, ${weatherData.sys.country}`,
      forecast,
    });
  } catch (error) {
    console.error("[v0] Weather API error:", error);

    // Return mock data on error
    return NextResponse.json({
      temperature: 24.5,
      humidity: 62,
      precipitation: 12.4,
      windSpeed: 14,
      windDirection: "NE",
      uvIndex: 8.2,
      condition: "Partly Cloudy",
      location: "Sacramento, CA",
      forecast: [],
    });
  }
}
