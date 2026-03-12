"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Tractor } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<{
    fullName: string;
    email: string;
    password: string;
    latitude: number;
    longitude: number;
  }>({
    fullName: "",
    email: "",
    password: "",
    latitude: 35.7595,
    longitude: -5.834,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          latitude: formData.latitude,
          longitude: formData.longitude,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-100/50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-card rounded-2xl shadow-xl overflow-hidden">
        <div className="pt-8 px-8 pb-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Tractor className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Farmer Registration</h1>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="fullName" className="text-sm font-semibold ml-1">
              Full Name
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              className="pl-3 py-3 border-2 border-[#858a20]"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-semibold ml-1">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="pl-3 py-3 border-2 border-[#858a20]"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm font-semibold ml-1">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="pl-3 py-3 border-2 border-[#858a20]"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="latitude" className="text-sm font-semibold ml-1">
              Farm Latitude
            </Label>
            <Input
              id="latitude"
              type="number"
              step={0.0001}
              min={-90}
              max={90}
              value={formData.latitude}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  latitude: parseFloat(e.target.value),
                })
              }
              className="pl-3 py-3 border-2 border-[#858a20]"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="longitude" className="text-sm font-semibold ml-1">
              Farm Longitude
            </Label>
            <Input
              id="longitude"
              type="number"
              step={0.0001}
              min={-180}
              max={180}
              value={formData.longitude}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  longitude: parseFloat(e.target.value),
                })
              }
              className="pl-3 py-3 border-2 border-[#858a20]"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full py-6 bg-secondary"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register Now"}
          </Button>

          <div>
            <span className="text-sm text-muted-foreground">
              Already have an account?{" "}
            </span>
            <a
              href="/login"
              className="text-sm font-medium text-primary hover:underline"
            >
              Log in here
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
