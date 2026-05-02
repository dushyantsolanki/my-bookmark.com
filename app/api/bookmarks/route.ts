import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Bookmark from "@/lib/models/Bookmark";
import Tag from "@/lib/models/Tag";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    
    // Get verified userId from middleware headers
    const userId = req.headers.get("x-user-id") || searchParams.get("userId");
    
    const collectionId = searchParams.get("collectionId");
    const status = searchParams.get("status");
    const isFavorite = searchParams.get("isFavorite");
    const isArchived = searchParams.get("isArchived");
    const isTrashed = searchParams.get("isTrashed");
    const q = searchParams.get("q");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized: UserId missing" }, { status: 401 });
    }

    let query: any = { userId };

    if (collectionId && collectionId !== "all") {
      query.collectionId = collectionId;
    }

    if (status) {
      query.status = status;
    }

    if (isFavorite === "true") {
      query.isFavorite = true;
    }

    // Default behaviors
    if (isTrashed === "true") {
      query.isTrashed = true;
      if (isArchived === "true") {
        query.isArchived = true;
      } else if (isArchived === "false") {
        query.isArchived = false;
      }
    } else {
      query.isTrashed = isTrashed === "true"; 
      if (isArchived === "true") {
        query.isArchived = true;
      } else {
        query.isArchived = false;
      }
    }

    // Search logic
    if (q) {
      const mongoose = require("mongoose");
      const userObjectId = new mongoose.Types.ObjectId(userId);

      // 1. Find matching tags first for this user
      const matchingTags = await Tag.find({
        userId: userObjectId,
        name: { $regex: q, $options: "i" }
      });
      const tagIds = matchingTags.map(t => t._id);

      // 2. Search in title, description, tags, or metadata
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { tags: { $in: tagIds } },
        { "metadata.ogTitle": { $regex: q, $options: "i" } },
        { "metadata.ogDescription": { $regex: q, $options: "i" } }
      ];
    }

    const bookmarks = await Bookmark.find(query)
      .sort({ createdAt: -1 });

    return NextResponse.json(bookmarks);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
