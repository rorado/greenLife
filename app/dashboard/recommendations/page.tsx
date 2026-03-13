"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Bell,
  Brain,
  Calendar,
  Thermometer,
  Star,
  Leaf,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CropRecommendation {
  id: string;
  name: string;
  score: number;
  description: string;
  season: string;
  waterNeed: number;
  growthPeriod: string;
  image: string;
}

export default function RecommendationsPage() {
  const [crops, setCrops] = useState<CropRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [season, setSeason] = useState("");
  const [aiRecommendation, setAiRecommendation] = useState<string>("");

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const res = await fetch("/api/recommendations?lat=38.58&lon=-121.49");
        if (res.ok) {
          const data = await res.json();
          setCrops(data.crops || []);
          setAiRecommendation(data.aiAdvice || "");
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, []);

  // Default crops if API fails
  const displayCrops =
    crops.length > 0
      ? crops
      : [
          {
            id: "wheat",
            name: "Wheat",
            score: 95,
            description:
              "High-yield cereal grain ideal for temperate climates with well-drained loamy soil.",
            season: "Autumn/Spring",
            waterNeed: 40,
            growthPeriod: "90-120 days",
            image:
              "https://lh3.googleusercontent.com/aida-public/AB6AXuDoBQDY7Wv25uiL9cH4ZoH-bjsTZE1fhEptyAAoHekA-RH_ZLkVH-EFFdBn2WEsr0Xv9-E_l5Vvhou6tfHQcLpjfyeXj2HWSw4erWeYQdLCllGq4U9KFFgNb7O4-Z6VNtirPtDilHSXzWfjEyGoY_g6kkm7n5MnrE9GnMrL8aO3iRBPVlIrhPTpVGRhPg4QP8bnyK3V4NkaPZhPzCS4btOPWZonyJ5f6hvZRLPZ2q0ZDojFCGHvBM7fC72aGgyOO9Q7BAORWpF_Y2mY",
          },
          {
            id: "tomatoes",
            name: "Tomatoes",
            score: 92,
            description:
              "Warm-season crop requiring consistent moisture and fertile, slightly acidic soil.",
            season: "Summer",
            waterNeed: 60,
            growthPeriod: "60-80 days",
            image:
              "https://lh3.googleusercontent.com/aida-public/AB6AXuBxJ210EFQ_FHOqzH9UvVIE1iK3ipp5AUfn5wtDBzY3Ldr2Eq2deA5JChiWuy8J6wpONtRN_rnrYYnD-xOrIJkF7jqULJ0mg5mmfpNljbKBCx4iqXenJdH2cnXpiywFm4pWq1tQomTx1LSOGzb3IhX_TTaWuELRSUoyA_JcqWdR4cptuzTIvQ5eni6_8YXFvqfMddG9SqSzAsvfwEzOUnzno0tLLuCpvasLj6yGyXP16yXO-L5su_f0jMqGnS9ympOBykauA06wehkK",
          },
          {
            id: "cucumbers",
            name: "Cucumbers",
            score: 84,
            description:
              "Fast-growing vine crop that thrives in sunny spots with rich, well-composted earth.",
            season: "Late Spring",
            waterNeed: 80,
            growthPeriod: "50-70 days",
            image:
              "https://lh3.googleusercontent.com/aida-public/AB6AXuDjdyedlAnj5AcGdnHQRhlI2eydG5yc5Sm55EFJISRLIsmmczhb-p_PdBGwxp1RhyMXlW5EZcQZ_ONVbnL-p2IxM_rCHzZtk9zWavVUrlUMl7CtFHaSgjKDbxXSD0BZ23Y8ZPL83kmUZwBc6YYkIg8TZjU4-Kf-JBosnLBFFiqifLAQa7s1FRzrOZC4Jq_NwNHf-HXcZW4vEoZsm6f5y3-pNVs5QdeMGyTuYLK7TZ4Ywa3VYNdUTQzWR6Tucx5RK2nUtFgo89JXopvO",
          },
          {
            id: "potatoes",
            name: "Potatoes",
            score: 78,
            description:
              "Versatile root vegetable requiring loose, sandy soil and moderate watering levels.",
            season: "Early Spring",
            waterNeed: 30,
            growthPeriod: "70-120 days",
            image:
              "https://lh3.googleusercontent.com/aida-public/AB6AXuDP_cI-RaHreDUGy1mNBn7HbnLScaS9lvMsWkH6e6PvaK9a5QEWtbYqCwZ-L8MsrTDbcfNQp8cyn67rVy0780dmUL9gyY_oHCGICPll8FmjOEYCHQx7gO4uoXjxMLXKtUbXAyW2eQTULYmLHq5CpC0liw86Qv1YMbSClZElD_WQeoJCaHIgNHV-7cY6CEeMZ-2cO96KIJM6qriDN_Oh_MLMkQc89RrWs50vXbTHo_2Aox_yYFhIo3kqXQrd7C_V1Bpr48U5w-osnC_d",
          },
        ];

  const filteredCrops = displayCrops.filter((crop) => {
    const matchesSearch = crop.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesSeason =
      !season || crop.season.toLowerCase().includes(season.toLowerCase());
    return matchesSearch && matchesSeason;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b bg-card px-6 lg:px-20 py-4 sticky top-0 z-50">
        <div className="flex items-center gap-4 text-primary">
          <div className="h-8 w-8 flex items-center justify-center bg-primary/10 rounded-lg">
            <Leaf className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold leading-tight tracking-tight">
            GreenLife
          </h2>
        </div>
        <div className="flex flex-1 justify-end gap-4 items-center">
          <div className="hidden md:flex relative max-w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search crops, soil types..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <div className="h-10 w-10 rounded-full bg-muted border-2 border-primary/20" />
        </div>
      </header>

      <main className="px-6 lg:px-20 py-8 max-w-7xl mx-auto w-full">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
            Recommended Crops For Your Region
          </h1>
          <p className="text-muted-foreground">
            Personalized agricultural insights based on your current farm
            location.
          </p>
        </div>

        {/* AI Advisor Panel */}
        <Card className="mb-10 bg-[#858a20] text-white border-0 shadow-lg">
          <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="h-16 w-16 shrink-0 bg-white/20 rounded-full flex items-center justify-center">
              <Brain className="h-8 w-8" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-bold text-lg mb-1">AI Crop Advisor</h3>
              <p className="text-white/90 leading-relaxed">
                {aiRecommendation || (
                  <>
                    Based on your location and weather conditions,{" "}
                    <span className="font-bold underline">tomatoes</span> and{" "}
                    <span className="font-bold underline">wheat</span> are the
                    most suitable crops this season.
                  </>
                )}
              </p>
            </div>
            <Button
              asChild
              variant="secondary"
              className="bg-white text-[#858a20] hover:bg-white/90 shrink-0"
            >
              <Link href="/recommendations/analysis">View Full Analysis</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search crops..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Select value={season} onValueChange={setSeason}>
              <SelectTrigger className="w-[140px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Season" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="spring">Spring</SelectItem>
                <SelectItem value="summer">Summer</SelectItem>
                <SelectItem value="autumn">Autumn</SelectItem>
                <SelectItem value="winter">Winter</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[140px]">
                <Thermometer className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Climate" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tropical">Tropical</SelectItem>
                <SelectItem value="temperate">Temperate</SelectItem>
                <SelectItem value="arid">Arid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Crop Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCrops.map((crop) => (
            <Card
              key={crop.id}
              className="group overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="h-48 w-full bg-muted overflow-hidden">
                <img
                  src={crop.image}
                  alt={crop.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-xl">{crop.name}</h3>
                  <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    {crop.score}%
                  </span>
                </div>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {crop.description}
                </p>
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-4">
                  <Calendar className="h-4 w-4" />
                  {crop.season}
                </div>
                <Button asChild className="w-full" variant="secondary">
                  <Link href={`dashboard/crops/${crop.id}`}>
                    View Details
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-20 border-t pt-10 pb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold mb-4">Dashboard</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/dashboard"
                    className="hover:text-primary transition-colors"
                  >
                    Farm Overview
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/reports"
                    className="hover:text-primary transition-colors"
                  >
                    Yield Reports
                  </Link>
                </li>
                <li>
                  <Link
                    href="/market"
                    className="hover:text-primary transition-colors"
                  >
                    Market Prices
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/guides"
                    className="hover:text-primary transition-colors"
                  >
                    Planting Guides
                  </Link>
                </li>
                <li>
                  <Link
                    href="/soil"
                    className="hover:text-primary transition-colors"
                  >
                    Soil Analysis
                  </Link>
                </li>
                <li>
                  <Link
                    href="/weather"
                    className="hover:text-primary transition-colors"
                  >
                    Weather Alerts
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-span-2 flex flex-col items-end">
              <div className="flex items-center gap-2 text-primary mb-4">
                <Leaf className="h-5 w-5" />
                <span className="font-bold text-lg">GreenLife</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering farmers with AI-driven precision agriculture.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
