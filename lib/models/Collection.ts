import mongoose, { Schema, Document } from "mongoose";

export interface ICollection extends Document {
  name: string;
  icon: string;
  color: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CollectionSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    icon: { type: String, default: "folder" },
    color: { type: String, default: "blue" },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Collection || mongoose.model<ICollection>("Collection", CollectionSchema);
