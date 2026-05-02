import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Tag from "@/lib/models/Tag";
import Bookmark from "@/lib/models/Bookmark";
import mongoose from "mongoose";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const { name, color } = await req.json();
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tag = await Tag.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id), userId },
      { name, color },
      { new: true, runValidators: true }
    );

    if (!tag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    return NextResponse.json(tag);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tag = await Tag.findOneAndDelete({ 
      _id: new mongoose.Types.ObjectId(id), 
      userId 
    });

    if (!tag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    // Also remove this tag from all bookmarks
    await Bookmark.updateMany(
      { tags: id },
      { $pull: { tags: id } }
    );

    return NextResponse.json({ message: "Tag deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
