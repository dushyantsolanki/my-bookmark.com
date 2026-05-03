import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Tag from "@/lib/models/Tag";
import { checkLimit } from "@/lib/subscription";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = req.headers.get("x-user-id") || searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tags = await Tag.find({ userId });

    return NextResponse.json(tags);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, color } = await req.json();
    const userId = req.headers.get("x-user-id");

    if (!name || !userId) {
      return NextResponse.json({ error: "Missing name or unauthorized" }, { status: 400 });
    }

    // Check subscription limits
    const limitCheck = await checkLimit(userId, "tags");
    if (!limitCheck.allowed) {
      return NextResponse.json({ error: limitCheck.message }, { status: 403 });
    }

    const tag = await Tag.create({ name, color, userId });

    return NextResponse.json(tag, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
