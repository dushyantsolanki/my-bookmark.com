import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Tag from "@/lib/models/Tag";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "64f1a2b3c4d5e6f7a8b9c0d1";

    const tags = await Tag.find({ userId });

    return NextResponse.json(tags);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, color, userId } = await req.json();

    if (!name || !userId) {
      return NextResponse.json({ error: "Missing name or userId" }, { status: 400 });
    }

    const tag = await Tag.create({ name, color, userId });

    return NextResponse.json(tag, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
