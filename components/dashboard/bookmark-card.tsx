import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Heart,
  MoreHorizontal,
  ExternalLink,
  Copy,
  Pencil,
  Trash2,
  Tag,
  Archive,
} from "lucide-react";
import { cn, getTagColor } from "@/lib/utils";
import { useBookmarksStore, type Bookmark } from "@/store/bookmarks-store";
import { usePathname } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { EditBookmarkModal } from "./edit-bookmark-modal";
import { ManageTagsModal } from "./manage-tags-modal";

interface BookmarkCardProps {
  bookmark: Bookmark;
  variant?: "grid" | "list";
}

export function BookmarkCard({
  bookmark,
  variant = "grid",
}: BookmarkCardProps) {
  const { tags: allTags, updateBookmark, deleteBookmark } = useBookmarksStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);

  // Find tags associated with this bookmark
  const bookmarkTags = allTags.filter((tag) => bookmark.tags?.includes(tag._id));

  const bookmarkId = (bookmark._id || bookmark.id) as string;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(bookmark.url);
  };

  const handleOpenUrl = () => {
    window.open(bookmark.url, "_blank");
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await updateBookmark(bookmarkId, { isFavorite: !bookmark.isFavorite });
  };

  const handleToggleArchive = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await updateBookmark(bookmarkId, { isArchived: !bookmark.isArchived });
  };

  const handleMoveToTrash = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (bookmark.isTrashed) {
      await deleteBookmark(bookmarkId);
    } else {
      await updateBookmark(bookmarkId, { isTrashed: true });
    }
  };

  const handleRestoreFromTrash = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await updateBookmark(bookmarkId, { isTrashed: false });
  };

  if (variant === "list") {
    return (
      <div className="group flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
        <div className="size-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
          <img
            src={bookmark.favicon || "/favicon.ico"}
            alt={bookmark.title}
            width={24}
            height={24}
            className={cn("size-6")}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium truncate">{bookmark.title}</h3>
            {bookmarkTags.length > 0 && (
              <div className="hidden sm:flex items-center gap-1">
                {bookmarkTags.slice(0, 2).map((tag) => {
                  const tagColor = getTagColor(tag.name);

                  return (
                    <span
                      key={tag._id}
                      style={tagColor}
                      className={cn(
                        "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors border",
                        "bg-[var(--tag-bg)] text-[var(--tag-text)] border-[var(--tag-border)] dark:bg-[var(--tag-bg-dark)] dark:text-[var(--tag-text-dark)]"
                      )}
                    >
                      <Tag className="size-2.5 mr-1 shrink-0 opacity-70" />
                      {tag.name}
                    </span>
                  );
                })}
                {bookmarkTags.length > 2 && (
                  <span className="text-[10px] text-muted-foreground">
                    +{bookmarkTags.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {bookmark.url}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={handleToggleFavorite}
          >
            <Heart
              className={cn(
                "size-4",
                bookmark.isFavorite && "fill-red-500 text-red-500"
              )}
            />
          </Button>
          <Button variant="ghost" size="icon" className="size-8" onClick={handleOpenUrl}>
            <ExternalLink className="size-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleCopyUrl}>
                <Copy className="size-4 mr-2" />
                Copy URL
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                <Pencil className="size-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsTagsModalOpen(true)}>
                <Tag className="size-4 mr-2" />
                Add Tags
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleToggleArchive}>
                <Archive className={cn("size-4 mr-2", bookmark.isArchived && "text-primary")} />
                {bookmark.isArchived ? "Unarchive" : "Archive"}
              </DropdownMenuItem>
              {bookmark.isTrashed ? (
                <DropdownMenuItem onClick={handleRestoreFromTrash}>
                  <RotateCcw className="size-4 mr-2" />
                  Restore
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuItem className="text-destructive" onClick={handleMoveToTrash}>
                <Trash2 className="size-4 mr-2" />
                {bookmark.isTrashed ? "Delete Permanently" : "Move to Trash"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative flex flex-col rounded-xl border bg-card overflow-hidden hover:bg-accent/30 transition-colors">
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1">
        <Button
          variant="secondary"
          size="icon"
          className="size-7 bg-accent-foreground/90  backdrop-blur-sm"
          onClick={handleToggleFavorite}
        >
          <Heart
            className={cn(
              "size-4 cursor-pointer ",
              bookmark.isFavorite && "fill-red-500 text-red-500"
            )}
          />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="size-7 bg-accent-foreground/90 backdrop-blur-sm"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleCopyUrl}>
              <Copy className="size-4 mr-2" />
              Copy URL
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleOpenUrl}>
              <ExternalLink className="size-4 mr-2" />
              Open in new tab
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
              <Pencil className="size-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsTagsModalOpen(true)}>
              <Tag className="size-4 mr-2" />
              Add Tags
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleToggleArchive}>
              <Archive className={cn("size-4 mr-2", bookmark.isArchived && "text-primary")} />
              {bookmark.isArchived ? "Unarchive" : "Archive"}
            </DropdownMenuItem>
            {bookmark.isTrashed ? (
              <DropdownMenuItem onClick={handleRestoreFromTrash}>
                <RotateCcw className="size-4 mr-2" />
                Restore
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuItem className="text-destructive" onClick={handleMoveToTrash}>
              <Trash2 className="size-4 mr-2" />
              {bookmark.isTrashed ? "Delete Permanently" : "Move to Trash"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <button
        className="w-full text-left cursor-pointer"
        onClick={handleOpenUrl}
      >
        <div className="h-32 bg-linear-to-br from-muted/50 to-muted flex items-center justify-center">
          <div className="size-12 rounded-xl bg-background shadow-sm flex items-center justify-center">
            <img
              src={bookmark.favicon || "/favicon.ico"}
              alt={bookmark.title}
              width={32}
              height={32}
              className={cn("size-8")}
            />
          </div>
        </div>

        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium line-clamp-1">{bookmark.title}</h3>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {bookmark.description}
          </p>
          {bookmarkTags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {bookmarkTags.slice(0, 3).map((tag) => {
                const tagColor = getTagColor(tag.name);
                return (
                  <span
                    key={tag._id}
                    style={tagColor}
                    className={cn(
                      "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors border",
                      "bg-[var(--tag-bg)] text-[var(--tag-text)] border-[var(--tag-border)] dark:bg-[var(--tag-bg-dark)] dark:text-[var(--tag-text-dark)]"
                    )}
                  >
                    <Tag className="size-2.5 mr-1 shrink-0 opacity-70" />
                    {tag.name}
                  </span>
                );
              })}
              {bookmarkTags.length > 3 && (
                <span className="text-[10px] text-muted-foreground py-0.5">
                  +{bookmarkTags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </button>

      <EditBookmarkModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        bookmark={bookmark}
      />

      <ManageTagsModal
        isOpen={isTagsModalOpen}
        onClose={() => setIsTagsModalOpen(false)}
        bookmark={bookmark}
      />
    </div>
  );
}
