import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  name?: string;
  image?: string;
  password?: string;
  subscription: "free" | "pro";
  razorpayCustomerId?: string;
  razorpaySubscriptionId?: string;
  subscriptionStatus?: "active" | "cancelled" | "expired" | "pending";
  nextBillingDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String },
    image: { type: String },
    password: { type: String }, // Hashed
    subscription: { type: String, enum: ["free", "pro"], default: "free" },
    razorpayCustomerId: { type: String },
    razorpaySubscriptionId: { type: String },
    subscriptionStatus: { type: String, enum: ["active", "cancelled", "expired", "pending"], default: "pending" },
    nextBillingDate: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
