import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Bookmark from "@/lib/models/Bookmark";
import { processBookmark } from "@/lib/scraper";
import { checkLimit } from "@/lib/subscription";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { url, title, description, collectionId, tags, isFavorite } = await req.json();
    const userId = req.headers.get("x-user-id");

    if (!url || !userId) {
      return NextResponse.json({ error: "Missing required fields or unauthorized" }, { status: 400 });
    }

    // Check subscription limits
    const limitCheck = await checkLimit(userId, "bookmarks");
    if (!limitCheck.allowed) {
      return NextResponse.json({ error: limitCheck.message }, { status: 403 });
    }

    // 1. Create the initial bookmark record
    const bookmark = await Bookmark.create({
      url,
      title: title || "Untitled Bookmark",
      description,
      userId,
      collectionId: collectionId === "all" ? undefined : collectionId,
      tags: tags || [],
      isFavorite,
      status: "pending",
    });

    // 2. Process it immediately (Scrape metadata and update DB)
    const processedBookmark = await processBookmark(bookmark._id.toString());

    return NextResponse.json({
      message: "Bookmark added and processed successfully",
      bookmark: processedBookmark,
    }, { status: 201 });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
