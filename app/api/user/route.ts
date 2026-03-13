// app/api/user/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: Request) {
  try {
    // Get the cookie header
    const cookieHeader = req.headers.get("cookie") || "";

    // Extract JWT from cookies (assuming your cookie name is 'token')
    const tokenMatch = cookieHeader
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("token="));

    if (!tokenMatch) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

    const token = tokenMatch.split("=")[1];

    // Verify JWT
    let payload: any;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = payload.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
