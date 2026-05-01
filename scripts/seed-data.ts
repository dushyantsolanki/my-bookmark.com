import mongoose from "mongoose";
import Collection from "../lib/models/Collection";
import Tag from "../lib/models/Tag";
import Bookmark from "../lib/models/Bookmark";

const MONGODB_URI = process.env.MONGODB_URI;
const USER_ID = "69f45ee4e50571547681571a";

const SAMPLE_COLLECTIONS = [
  { name: "Development", icon: "code", color: "blue" },
  { name: "Design", icon: "palette", color: "purple" },
  { name: "Reading List", icon: "book-open", color: "green" },
  { name: "Tools", icon: "wrench", color: "orange" },
  { name: "Inspiration", icon: "sparkles", color: "pink" },
];

const SAMPLE_TAGS = [
  "React", "Next.js", "TypeScript", "Tailwind", "Node.js",
  "UI/UX", "Database", "AI", "Open Source", "Tutorial"
];

const SAMPLE_URLS = [
  "https://nextjs.org", "https://tailwindcss.com", "https://mongoosejs.com",
  "https://github.com", "https://vercel.com", "https://react.dev",
  "https://typescriptlang.org", "https://lucide.dev", "https://mongodb.com",
  "https://framer.com/motion", "https://radix-ui.com", "https://shadcn.com"
];

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected.");

    // 1. Clear existing data for this user
    console.log("Clearing existing data...");
    await Promise.all([
      Collection.deleteMany({ userId: USER_ID }),
      Tag.deleteMany({ userId: USER_ID }),
      Bookmark.deleteMany({ userId: USER_ID }),
    ]);

    // 2. Create Collections
    console.log("Creating collections...");
    const createdCollections = await Collection.insertMany(
      SAMPLE_COLLECTIONS.map(c => ({ ...c, userId: USER_ID }))
    );

    // 3. Create Tags
    console.log("Creating tags...");
    const createdTags = await Tag.insertMany(
      SAMPLE_TAGS.map(name => ({ name, userId: USER_ID, color: "gray" }))
    );

    // 4. Create 100 Bookmarks
    console.log("Creating 100 bookmarks...");
    const bookmarks = [];
    for (let i = 1; i <= 100; i++) {
      const randomUrl = SAMPLE_URLS[Math.floor(Math.random() * SAMPLE_URLS.length)];
      const randomCollection = createdCollections[Math.floor(Math.random() * createdCollections.length)];

      // Randomly pick 1-3 tags
      const numTags = Math.floor(Math.random() * 3) + 1;
      const shuffledTags = [...createdTags].sort(() => 0.5 - Math.random());
      const selectedTags = shuffledTags.slice(0, numTags).map(t => t.name);

      bookmarks.push({
        userId: USER_ID,
        url: `${randomUrl}?q=${i}`, // Make unique
        title: `Fake Bookmark #${i}: ${randomUrl.split("//")[1]}`,
        description: `This is a generated description for bookmark number ${i}. It contains some sample text to test the UI layout and search functionality.`,
        favicon: `https://www.google.com/s2/favicons?domain=${randomUrl}&sz=128`,
        collectionId: Math.random() > 0.2 ? randomCollection._id : undefined, // 80% have a collection
        tags: selectedTags,
        isFavorite: Math.random() > 0.8, // 20% are favorites
        status: "processed",
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)), // Random date in past
        metadata: {
          ogTitle: `Open Graph Title for #${i}`,
          ogDescription: `OG Description for fake bookmark ${i}`,
          contentType: i % 5 === 0 ? "tool" : "article",
        }
      });
    }

    await Bookmark.insertMany(bookmarks);

    console.log("Seed completed successfully!");
    console.log(`Created: ${createdCollections.length} collections, ${createdTags.length} tags, 100 bookmarks.`);

    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}

seed();
