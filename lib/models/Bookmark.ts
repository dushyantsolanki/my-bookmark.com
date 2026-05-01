import mongoose, { Schema, Document } from "mongoose";

export interface IBookmark extends Document {
  userId: mongoose.Types.ObjectId;
  url: string;
  title: string;
  description?: string;
  favicon?: string;
  collectionId?: mongoose.Types.ObjectId;
  tags: string[];
  isFavorite: boolean;
  isArchived: boolean;
  isTrashed: boolean;
  status: "pending" | "processing" | "processed" | "error";
  metadata: {
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const BookmarkSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    url: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    favicon: { type: String },
    collectionId: { type: Schema.Types.ObjectId, ref: "Collection" },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    isFavorite: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    isTrashed: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending", "processing", "processed", "error"],
      default: "pending"
    },
    metadata: {
      ogTitle: { type: String },
      ogDescription: { type: String },
      ogImage: { type: String },
    },
  },
  { timestamps: true }
);

// Index for search optimization
BookmarkSchema.index({
  title: "text",
  description: "text",
  "metadata.ogTitle": "text",
});

export default mongoose.models.Bookmark || mongoose.model<IBookmark>("Bookmark", BookmarkSchema);
