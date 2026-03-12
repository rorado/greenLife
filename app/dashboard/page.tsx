"use client";

import { useState, useEffect } from "react";
import {
  Thermometer,
  Droplets,
  CloudRain,
  Sun,
  Calendar,
  Plus,
  CloudSun,
  Droplet,
  AlertTriangle,
  Tractor,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface User {
  id: number;
  name: string;
}

export interface FarmData {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  precipitation: number;
  uvIndex: number;
  condition: string;
  location: string;
}

interface SoilData {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [farm, setFarm] = useState<FarmData | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [soil, setSoil] = useState<SoilData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch logged-in user
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/user");
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchUser();
  }, []);

  // Fetch user's farm
  useEffect(() => {
    if (!user) return;

    async function fetchFarm() {
      try {
        const res = await fetch(`/api/farm/${user?.id}`);
        if (!res.ok) throw new Error("Failed to fetch farm");
        const data = await res.json();
        setFarm(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchFarm();
  }, [user]);

  // Fetch weather & soil data
  useEffect(() => {
    if (!farm) return;

    async function fetchData() {
      try {
        const [weatherRes, soilRes] = await Promise.all([
          fetch(`/api/weather?lat=${farm?.latitude}&lon=${farm?.longitude}`),
          fetch(`/api/soil?lat=${farm?.latitude}&lon=${farm?.longitude}`),
        ]);

        if (weatherRes.ok) setWeather(await weatherRes.json());
        if (soilRes.ok) setSoil(await soilRes.json());
      } catch (err) {
        console.error("Error fetching farm data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [farm]);

  // Default values if APIs fail
  const displayWeather: WeatherData = weather || {
    temperature: 24.5,
    humidity: 62,
    precipitation: 12.4,
    uvIndex: 8.2,
    condition: "Partly Cloudy",
    location: farm?.name || "Unknown Location",
  };

  const displaySoil: SoilData = soil || {
    nitrogen: 75,
    phosphorus: 45,
    potassium: 82,
  };

  const recommendations = [
    {
      type: "irrigation",
      title: "Irrigation Alert",
      description: "Increase watering in Plot B-3 by 15% due to heat.",
      icon: Droplet,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-l-orange-500",
    },
    {
      type: "pest",
      title: "Pest Control",
      description: "High activity detected. Recommended organic spray.",
      icon: AlertTriangle,
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-l-primary",
    },
    {
      type: "harvest",
      title: "Harvesting Window",
      description: "Plot C-1 ready for harvest within next 48 hours.",
      icon: Tractor,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
      borderColor: "border-l-amber-400",
    },
  ];

  if (loading) return <p className="p-8">Loading dashboard...</p>;

  return (
    <div className="p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            {farm?.name || "Farm"} Overview
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name || "Farmer"}. Here's what's happening
            today.
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Temperature */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Thermometer className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                +2.4°
              </span>
            </div>
            <p className="text-muted-foreground text-sm font-medium">
              Average Temperature
            </p>
            <p className="text-2xl font-black">
              {displayWeather.temperature}°C
            </p>
          </CardContent>
        </Card>

        {/* Soil Humidity */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-secondary/10 p-2 rounded-lg">
                <Droplets className="h-5 w-5 text-secondary" />
              </div>
              <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                -5%
              </span>
            </div>
            <p className="text-muted-foreground text-sm font-medium">
              Soil Humidity
            </p>
            <p className="text-2xl font-black">{displayWeather.humidity}%</p>
          </CardContent>
        </Card>

        {/* Precipitation */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-50 p-2 rounded-lg">
                <CloudRain className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded">
                Stable
              </span>
            </div>
            <p className="text-muted-foreground text-sm font-medium">
              Daily Precipitation
            </p>
            <p className="text-2xl font-black">
              {displayWeather.precipitation} mm
            </p>
          </CardContent>
        </Card>

        {/* UV Index */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-50 p-2 rounded-lg">
                <Sun className="h-5 w-5 text-orange-500" />
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                High
              </span>
            </div>
            <p className="text-muted-foreground text-sm font-medium">
              UV Index
            </p>
            <p className="text-2xl font-black">{displayWeather.uvIndex}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className={`flex gap-4 p-3 rounded-lg bg-muted border-l-4 ${rec.borderColor}`}
              >
                <div
                  className={`w-10 h-10 rounded-full ${rec.bgColor} flex-shrink-0 flex items-center justify-center`}
                >
                  <rec.icon className={`h-5 w-5 ${rec.color}`} />
                </div>
                <div>
                  <p className="text-sm font-bold">{rec.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {rec.description}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
