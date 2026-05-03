import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!signature || !secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);
    await dbConnect();

    switch (event.event) {
      case "subscription.authenticated":
      case "subscription.charged":
        // Update subscription end date or status
        const subId = event.payload.subscription.entity.id;
        await User.findOneAndUpdate(
          { razorpaySubscriptionId: subId },
          {
            subscription: "pro",
            subscriptionStatus: "active",
            nextBillingDate: new Date(event.payload.subscription.entity.charge_at * 1000),
          }
        );
        break;

      case "subscription.cancelled":
      case "subscription.expired":
        const expiredSubId = event.payload.subscription.entity.id;
        await User.findOneAndUpdate(
          { razorpaySubscriptionId: expiredSubId },
          {
            subscription: "free",
            subscriptionStatus: event.event === "subscription.cancelled" ? "cancelled" : "expired",
          }
        );
        break;

      default:
        console.log("Unhandled Razorpay event:", event.event);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Razorpay webhook error:", error);
    return NextResponse.json(
      { error: error.message || "Webhook handling failed" },
      { status: 500 }
    );
  }
}
