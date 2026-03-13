"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Leaf,
  Sun,
  MapPin,
  Brain,
  TrendingUp,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-50 bg-primary text-primary-foreground px-4 md:px-20 lg:px-40 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <Leaf className="h-7 w-7" />
          <h2 className="text-xl font-bold leading-tight tracking-tight">
            GreenLife
          </h2>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/">Home</Link>
          {isLoggedIn && <Link href="/dashboard">Dashboard</Link>}
          <Link href="/dashboard/weather">Weather</Link>
          <Link href="/dashboard/recommendations">Crop Recommendations</Link>
          <Link href="/about">About</Link>
        </div>
        <Button
          asChild
          variant="secondary"
          className="bg-white text-primary hover:bg-white/90"
        >
          <Link href="/register">Sign Up</Link>
        </Button>
      </nav>

      <main className="flex-1">
        <section className="px-4 md:px-20 lg:px-40 py-12 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <span className="text-primary font-bold tracking-widest text-xs uppercase bg-primary/10 w-fit px-3 py-1 rounded-full">
                  Future of Agriculture
                </span>
                <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight text-balance">
                  AI-Powered <span className="text-primary">Smart Farming</span>
                </h1>
                <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-xl">
                  Helping farmers choose the best crops using weather and
                  location data. Optimize your yield with data-driven insights.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="gap-2 shadow-lg">
                  <Link href="/dashboard">
                    Start Farming Smart
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="shadow-lg"
                >
                  <Link href="/recommendations">View Recommendations</Link>
                </Button>
              </div>
              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-muted" />
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-muted/80" />
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-muted/60" />
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  Trusted by 5,000+ farmers across the globe
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="w-full aspect-square rounded-3xl bg-muted overflow-hidden shadow-2xl relative">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVFG0dcznSc2dmi_fw_HYzMYDTzrOGnth02sCFkZPWdxKXUR0cVhf0zqahUASyNh1dZTHDuWUyfmpDwZ4maeajyCvwpqDzqgkSDtZkL9lvx5-UAiAoRsLMhAl_j6zxd8xoOLqS1iBFXyPyWRy60vL-wGfGjqKijaa-k5rNgSEDPKzIVkrNmCMvHuxGef_-nazrS2OQohjJ9GMOZIYrTuAAnE6nqO-utI-sS2BxVsPLdqwwfYYv6um9w74tMODDp4CE-J9ZjKSeZetq"
                  alt="Lush green rows of crops in a modern field"
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-linear-to-t from-primary/40 to-transparent" />
                <div className="absolute bottom-6 right-6 bg-card p-4 rounded-2xl shadow-xl flex items-center gap-4 border">
                  <div className="bg-primary/20 p-3 rounded-full text-primary">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                      Avg. Yield Increase
                    </p>
                    <p className="text-xl font-bold">24.8%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-card py-20 px-4 md:px-20 lg:px-40">
          <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-4">
            <h2 className="text-3xl md:text-4xl font-bold text-balance">
              Why Choose GreenLife?
            </h2>
            <p className="text-muted-foreground text-lg">
              Our platform leverages advanced AI and satellite imagery to
              optimize your agricultural output at every stage.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background p-8 rounded-2xl shadow-sm border hover:shadow-xl transition-shadow group">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Sun className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Weather Insights</h3>
              <p className="text-muted-foreground leading-relaxed">
                Real-time localized weather data and 14-day forecasts to plan
                your irrigation and harvest perfectly.
              </p>
            </div>
            <div className="bg-background p-8 rounded-2xl shadow-sm border hover:shadow-xl transition-shadow group">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <MapPin className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Location Intelligence</h3>
              <p className="text-muted-foreground leading-relaxed">
                Soil and terrain analysis tailored to your specific GPS
                coordinates using high-resolution mapping.
              </p>
            </div>
            <div className="bg-background p-8 rounded-2xl shadow-sm border hover:shadow-xl transition-shadow group">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Brain className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Crop Optimization</h3>
              <p className="text-muted-foreground leading-relaxed">
                AI models that suggest the most profitable and sustainable crops
                based on soil health and market trends.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-card border-t py-12 px-4 md:px-20 lg:px-40">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-primary">
              <Leaf className="h-7 w-7" />
              <h2 className="text-xl font-bold leading-tight">GreenLife</h2>
            </div>
            <p className="text-muted-foreground text-sm">
              Empowering the next generation of farmers with AI and real-time
              data analysis.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
