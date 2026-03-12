"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Bell,
  Download,
  Thermometer,
  Droplets,
  CloudRain,
  Wind,
  Sun,
  CloudSun,
  Cloud,
  CloudLightning,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface WeatherData {
  temperature: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  windDirection: string;
  uvIndex: number;
  condition: string;
  location: string;
  forecast: Array<{ day: string; temp: number; condition: string }>;
}

export default function WeatherPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather(lat?: number, lon?: number) {
      try {
        const url =
          lat && lon ? `/api/weather?lat=${lat}&lon=${lon}` : `/api/weather`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch weather data");

        const data: WeatherData = await res.json();
        setWeather(data);
      } catch (error) {
        console.error("Error fetching weather:", error);
      } finally {
        setLoading(false);
      }
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
        },
        () => {
          console.warn("Geolocation denied, using default location.");
          fetchWeather();
        },
      );
    } else {
      console.warn("Geolocation not supported, using default location.");
      fetchWeather();
    }
  }, []);

  const forecastIcons: Record<string, any> = {
    clear: Sun,
    cloudy: Cloud,
    rain: CloudRain,
    drizzle: CloudRain,
    thunderstorm: CloudLightning,
    snow: Cloud,
    mist: Cloud,
    partly_cloudy: CloudSun,
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-primary">
        <p className="text-lg font-bold animate-pulse">
          Loading weather data...
        </p>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-red-500">
        <p className="text-lg font-bold">Failed to load weather data</p>
      </div>
    );
  }

  const weatherCards = [
    {
      title: "Temperature",
      value: `${weather.temperature}°C`,
      change: "+2°",
      changeColor: "text-green-500",
      description: "Optimal growing conditions for current crop cycle.",
      progress: 72,
      progressColor: "bg-orange-500",
      icon: Thermometer,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      title: "Air Humidity",
      value: `${weather.humidity}%`,
      change: "Stable",
      changeColor: "text-muted-foreground",
      description: "High transpiration efficiency expected today.",
      progress: weather.humidity,
      progressColor: "bg-blue-500",
      icon: Droplets,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Precipitation",
      value: `${weather.precipitation}mm`,
      change: "Light",
      changeColor: "text-amber-500",
      description: "Light showers expected between 2PM - 4PM.",
      progress: 24,
      progressColor: "bg-cyan-500",
      icon: CloudRain,
      iconBg: "bg-cyan-50",
      iconColor: "text-cyan-600",
    },
    {
      title: "Wind Speed",
      value: `${weather.windSpeed} km/h`,
      change: weather.windDirection,
      changeColor: "text-green-500",
      description: "Gentle breeze; ideal for automated crop spraying.",
      progress: 45,
      progressColor: "bg-teal-500",
      icon: Wind,
      iconBg: "bg-teal-50",
      iconColor: "text-teal-600",
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md px-8 py-4 border-b flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Weather in {weather.location}</h2>
            <p className="text-sm text-muted-foreground">
              Real-time environmental metrics
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search data points..."
                className="pl-10 w-64"
              />
            </div>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button className="gap-2 shadow-lg">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        </header>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {weatherCards.map((card, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div
                    className={`h-12 w-12 rounded-full ${card.iconBg} flex items-center justify-center mb-4`}
                  >
                    <card.icon className={`h-6 w-6 ${card.iconColor}`} />
                  </div>
                  <p className="text-muted-foreground text-sm font-semibold uppercase tracking-wider mb-1">
                    {card.title}
                  </p>
                  <div className="flex items-baseline gap-2 mb-2">
                    <h4 className="text-4xl font-black">{card.value}</h4>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mb-4">
                    <div
                      className={`h-full ${card.progressColor}`}
                      style={{ width: `${card.progress}%` }}
                    />
                  </div>
                  <p className="text-muted-foreground text-sm font-medium italic">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
            {weather.forecast.map((day) => {
              const Icon = forecastIcons[day.condition] || Cloud;
              return (
                <Card key={day.day} className="text-center p-4">
                  <p className="font-bold">{day.day}</p>
                  <Icon className="h-6 w-6 mx-auto my-2" />
                  <p className="text-lg font-black">{day.temp}°C</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {day.condition}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
