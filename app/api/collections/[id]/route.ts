import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Collection from "@/lib/models/Collection";
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

    const collection = await Collection.findByIdAndUpdate(
      new mongoose.Types.ObjectId(id), 
      updates, 
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!collection) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }

    return NextResponse.json(collection);
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

    const collection = await Collection.findByIdAndDelete(new mongoose.Types.ObjectId(id));

    if (!collection) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }

    // Uncategorize bookmarks that were in this collection
    await Bookmark.updateMany({ collectionId: id }, { $unset: { collectionId: "" } });

    return NextResponse.json({ message: "Collection deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
