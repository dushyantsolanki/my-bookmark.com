import User from "@/lib/models/User";
import Bookmark from "@/lib/models/Bookmark";
import Collection from "@/lib/models/Collection";
import Tag from "@/lib/models/Tag";

export const SUBSCRIPTION_LIMITS = {
  free: {
    bookmarks: 10,
    collections: 3,
    tags: 5,
  },
  pro: {
    bookmarks: Infinity,
    collections: Infinity,
    tags: Infinity,
  },
};

export async function checkLimit(userId: string, type: "bookmarks" | "collections" | "tags") {
  const user = await User.findById(userId);
  if (!user) return { allowed: false, message: "User not found" };

  const tier = user.subscription || "free";
  const limit = SUBSCRIPTION_LIMITS[tier as keyof typeof SUBSCRIPTION_LIMITS][type];

  let currentCount = 0;
  if (type === "bookmarks") {
    currentCount = await Bookmark.countDocuments({ userId });
  } else if (type === "collections") {
    currentCount = await Collection.countDocuments({ userId });
  } else if (type === "tags") {
    currentCount = await Tag.countDocuments({ userId });
  }

  if (currentCount >= limit) {
    return {
      allowed: false,
      message: `Limit reached. You have used ${currentCount}/${limit} ${type}. Upgrade to Pro for unlimited access.`,
    };
  }

  return { allowed: true };
}
