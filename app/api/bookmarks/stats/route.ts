import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Bookmark from "@/lib/models/Bookmark";
import Collection from "@/lib/models/Collection";
import Tag from "@/lib/models/Tag";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "UserId is required" }, { status: 400 });
    }

    const [totalBookmarks, favorites, collections, tags] = await Promise.all([
      Bookmark.countDocuments({ userId, isTrashed: false }),
      Bookmark.countDocuments({ userId, isFavorite: true, isTrashed: false }),
      Collection.countDocuments({ userId }),
      Tag.countDocuments({ userId }),
    ]);

    return NextResponse.json({
      totalBookmarks,
      favorites,
      collections,
      tags,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
