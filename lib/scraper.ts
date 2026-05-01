import ogs from "open-graph-scraper";
import Bookmark from "./models/Bookmark";

export interface ScrapedMetadata {
  title: string;
  description: string;
  favicon: string;

}

export async function scrapeMetadata(url: string): Promise<ScrapedMetadata> {
  let ogData: any = {};
  try {
    const { result } = await ogs({ url });
    ogData = result;
  } catch (error) {
    console.error("Scraping error for URL:", url, error);
  }

  // Extract favicon
  let faviconUrl = "/favicon.ico";

  const urlObj = new URL(url);
  faviconUrl = `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`;

  console.log(ogData)

  return {
    title: ogData.author || ogData.ogTitle || "",
    description: ogData.ogDescription || "",
    favicon: faviconUrl,
  };
}

export async function processBookmark(bookmarkId: string) {
  try {
    const bookmark = await Bookmark.findById(bookmarkId);
    if (!bookmark) throw new Error("Bookmark not found");

    // 1. Mark as processing
    await Bookmark.findByIdAndUpdate(bookmarkId, { status: "processing" });

    // 2. Scrape metadata
    const metadata = await scrapeMetadata(bookmark.url);

    // 3. Update bookmark with full results
    const updatedBookmark = await Bookmark.findByIdAndUpdate(bookmarkId, {
      status: "processed",
      title: metadata.title || bookmark.title,
      description: metadata.description || bookmark.description,
      favicon: metadata.favicon || bookmark.favicon,
      metadata: {
        ogTitle: metadata.title,
        ogDescription: metadata.description,
      }
    }, { new: true });

    return updatedBookmark;
  } catch (error) {
    console.error(`Error processing bookmark ${bookmarkId}:`, error);
    await Bookmark.findByIdAndUpdate(bookmarkId, { status: "error" });
    throw error;
  }
}
