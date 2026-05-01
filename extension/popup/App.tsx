import React, { useState, useEffect } from "react";
import { Bookmark, LayoutDashboard, Plus, Loader2 } from "lucide-react";

// Mocking the environment as it would be in a browser extension
export const ExtensionPopup = () => {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState<{ url: string; title: string } | null>(null);

  useEffect(() => {
    // In a real extension, you would use chrome.tabs.query
    setCurrentTab({
      url: "https://example.com",
      title: "Example Domain"
    });
    
    // Fetch total count from your real API
    const fetchCount = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/bookmarks/stats?userId=user_123");
        const data = await response.json();
        if (data.totalCount !== undefined) {
          setCount(data.totalCount);
        }
      } catch (error) {
        console.error("Failed to fetch count", error);
      }
    };
    
    fetchCount();
  }, []);

  const handleAddBookmark = async () => {
    setLoading(true);
    try {
      // API Call to the microservice (running in Next.js)
      const response = await fetch("http://localhost:3000/api/bookmarks/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: currentTab?.url,
          title: currentTab?.title,
          userId: "user_123", // Replace with real auth user id
        })
      });
      
      if (response.ok) {
        setCount(prev => prev + 1);
        alert("Added to Bookmarks!");
      }
    } catch (error) {
      console.error("Failed to add bookmark", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[300px] bg-background border rounded-lg shadow-xl overflow-hidden font-sans">
      <div className="p-4 bg-primary text-primary-foreground flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bookmark className="size-5" />
          <span className="font-bold">MyBookmarks</span>
        </div>
        <div className="bg-primary-foreground/20 px-2 py-0.5 rounded text-xs">
          {count} Total
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="text-sm text-muted-foreground truncate border-b pb-2">
          {currentTab?.title || "No active tab"}
        </div>

        <button
          onClick={handleAddBookmark}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 h-10 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Plus className="size-4" />
          )}
          Add to Bookmark
        </button>

        <button
          onClick={() => window.open("http://localhost:3000/dashboard", "_blank")}
          className="w-full flex items-center justify-center gap-2 h-10 border border-input bg-background hover:bg-accent rounded-md transition-colors"
        >
          <LayoutDashboard className="size-4" />
          Go to Dashboard
        </button>
      </div>

      <div className="p-2 bg-muted/50 text-[10px] text-center text-muted-foreground border-t">
        Logged in as lndev@example.com
      </div>
    </div>
  );
};

export default ExtensionPopup;
