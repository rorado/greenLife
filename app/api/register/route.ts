import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, location, latitude, longitude } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // start with values from request body
    let userLat = latitude;
    let userLon = longitude;

    // if lat/lon are missing but location string exists, fetch from OpenStreetMap
    if ((userLat === undefined || userLon === undefined) && location) {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          location,
        )}&format=json&limit=1`,
      );
      const geoData = await res.json();

      userLat = geoData?.[0]?.lat ? parseFloat(geoData[0].lat) : 35.7595;
      userLon = geoData?.[0]?.lon ? parseFloat(geoData[0].lon) : -5.834;
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        latitude: userLat,
        longitude: userLon,
      },
    });

    return NextResponse.json({ message: "User registered", user });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
