import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/jwt";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    let token = authHeader?.split(" ")[1];

    if (!token) {
      // Try to get from cookies if not in header
      const cookieHeader = req.headers.get("cookie");
      const cookies = Object.fromEntries(
        cookieHeader?.split("; ").map((c) => c.split("=")) || []
      );
      token = cookies["accessToken"];
    }

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = verifyAccessToken(token) as any;
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
