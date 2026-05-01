import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Bookmark from "@/lib/models/Bookmark";
import { processBookmark } from "@/lib/scraper";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { url, title, description, userId, collectionId, tags, isFavorite } = await req.json();

    if (!url || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
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
