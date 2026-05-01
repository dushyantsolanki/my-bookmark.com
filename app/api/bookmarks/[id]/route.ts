import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Bookmark from "@/lib/models/Bookmark";
import mongoose from "mongoose";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const updates = await req.json();

    // Handle 'all' collectionId by setting it to null for MongoDB
    if (updates.collectionId === "all") {
      updates.collectionId = null;
    }

    const bookmark = await Bookmark.findByIdAndUpdate(
      new mongoose.Types.ObjectId(id),
      updates,
      { returnDocument: "after", runValidators: true }
    );

    if (!bookmark) {
      return NextResponse.json({ error: "Bookmark not found" }, { status: 404 });
    }

    return NextResponse.json(bookmark);
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

    const bookmark = await Bookmark.findByIdAndDelete(new mongoose.Types.ObjectId(id));

    if (!bookmark) {
      return NextResponse.json({ error: "Bookmark not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Bookmark deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
