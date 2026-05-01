import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Bookmark from "@/lib/models/Bookmark";

export async function GET(req: Request) {
  try {
    await dbConnect();
    
    // Extract userId from search params (in a real app, this would be from auth session)
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "UserId is required" }, { status: 400 });
    }

    const totalCount = await Bookmark.countDocuments({ userId });

    return NextResponse.json({ totalCount });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
