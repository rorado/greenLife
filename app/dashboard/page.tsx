"use client";

import { useState, useEffect } from "react";
import {
  Thermometer,
  Droplets,
  CloudRain,
  Sun,
  Calendar,
  Plus,
  FlaskConical,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PlantChart from "@/components/graphAi";

interface User {
  id: number;
  name: string;
}
interface FarmData {
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
}
interface SoilData {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
}
interface PlantRecommendation {
  title: string;
  value: string;
  score: number;
}

interface AIAnalysis {
  plants: PlantRecommendation[];
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [farm, setFarm] = useState<FarmData | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [soil, setSoil] = useState<SoilData | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user
  useEffect(() => {
    fetch("/api/user")
      .then((r) => r.json())
      .then(setUser)
      .catch(console.error);
  }, []);

  // Fetch farm
  useEffect(() => {
    if (!user) return;
    fetch(`/api/farm/${user.id}`)
      .then((r) => r.json())
      .then(setFarm)
      .catch(console.error);
  }, [user]);

  // Fetch weather & soil
  useEffect(() => {
    if (!farm) return;
    const fetchData = async () => {
      try {
        const [wRes, sRes] = await Promise.all([
          fetch(`/api/weather?lat=${farm.latitude}&lon=${farm.longitude}`),
          fetch(`/api/soil?lat=${farm.latitude}&lon=${farm.longitude}`),
        ]);
        if (wRes.ok) setWeather(await wRes.json());
        if (sRes.ok) setSoil(await sRes.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [farm]);

  // Call AI for plant recommendations
  useEffect(() => {
    if (!weather || !soil) return;
    const fetchAI = async () => {
      try {
        const res = await fetch("/api/ai-recommendation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ weather, soil }),
        });
        const data = await res.json();
        setAiAnalysis(data.analysis);
      } catch (err) {
        console.error("AI fetch error:", err);
      }
    };
    fetchAI();
  }, [weather, soil]);

  if (loading) return <p className="p-8">Loading dashboard...</p>;

  const displayWeather = weather || {
    temperature: 25,
    humidity: 60,
    precipitation: 5,
    uvIndex: 6,
  };
  const displaySoil = soil || {
    nitrogen: 75,
    phosphorus: 45,
    potassium: 82,
    ph: 6.5,
  };

  return (
    <div className="p-8">
      {/* Header */}
      <header className="flex justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            {farm?.name || "Farm"} Overview
          </h1>
          <p className="text-muted-foreground">
            Welcome back {user?.name || "Farmer"}
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            {new Date().toLocaleDateString()}
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <Thermometer className="mb-2 text-red-500" />
            <p className="text-sm">Temperature</p>
            <p className="text-2xl font-bold">{displayWeather.temperature}°C</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Droplets className="mb-2 text-blue-500" />
            <p className="text-sm">Humidity</p>
            <p className="text-2xl font-bold">{displayWeather.humidity}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <CloudRain className="mb-2 text-blue-600" />
            <p className="text-sm">Rain</p>
            <p className="text-2xl font-bold">
              {displayWeather.precipitation} mm
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Sun className="mb-2 text-orange-500" />
            <p className="text-sm">UV Index</p>
            <p className="text-2xl font-bold">{displayWeather.uvIndex}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <FlaskConical className="mb-2 text-purple-600" />
            <p className="text-sm">Soil pH</p>
            <p className="text-2xl font-bold">{displaySoil.ph}</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Plant Recommendations */}
      {aiAnalysis && aiAnalysis?.plants?.length > 0 ? (
        <div className="space-y-4">
          {aiAnalysis.plants.map((plant, idx) => (
            <Card key={idx}>
              <CardContent>
                <p className="font-semibold">{plant.title}</p>
                <p className="text-sm text-muted-foreground">{plant.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">
          loading plant recommendations...
        </p>
      )}

      {aiAnalysis && aiAnalysis.plants?.length > 0 && (
        <div className="mb-8">
          <PlantChart plants={aiAnalysis.plants} />
        </div>
      )}
    </div>
  );
}
