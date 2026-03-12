import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ latitude: 38.58, longitude: -121.49 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { location: true },
    });

    const city = "Temara , morocco";

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        city,
      )}&limit=1`,
      {
        headers: {
          "User-Agent": "MyFarmApp/1.0",
          "Accept-Language": "en",
        },
      },
    );

    const data = await response.json();

    if (!data || data.length === 0) {
      return NextResponse.json({ latitude: 38.58, longitude: -121.49 });
    }

    return NextResponse.json({
      latitude: parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon),
    });
  } catch (err) {
    return NextResponse.json({ latitude: 38.58, longitude: -121.49 });
  }
}
