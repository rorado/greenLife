import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();

  if (url.pathname.startsWith("/dashboard")) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    try {
      jwt.verify(token, JWT_SECRET);
      return NextResponse.next();
    } catch {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }
  if (url.pathname === "/login" || url.pathname === "/signup") {
    const token = req.cookies.get("token")?.value;

    if (token) {
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
