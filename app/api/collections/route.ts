import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Collection from "@/lib/models/Collection";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = req.headers.get("x-user-id") || searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized: UserId missing" }, { status: 401 });
    }

    const collections = await Collection.find({ userId });
    return NextResponse.json(collections);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, icon, color } = await req.json();
    const userId = req.headers.get("x-user-id");

    if (!name || !userId) {
      return NextResponse.json({ error: "Name and Authorization are required" }, { status: 400 });
    }

    const collection = await Collection.create({
      name,
      icon: icon || "Folder",
      color: color || "#3b82f6",
      userId,
    });

    return NextResponse.json(collection, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
