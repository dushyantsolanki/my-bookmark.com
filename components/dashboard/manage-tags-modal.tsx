"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tag as TagIcon, Plus, X, Loader2, Check } from "lucide-react";
import { useBookmarksStore, type Bookmark, type Tag } from "@/store/bookmarks-store";
import { cn, getTagColor } from "@/lib/utils";

interface ManageTagsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmark: Bookmark;
}

export function ManageTagsModal({ isOpen, onClose, bookmark }: ManageTagsModalProps) {
  const { tags: allTags, updateBookmark, createTag, fetchTags } = useBookmarksStore();
  const [loading, setLoading] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedTagIds(bookmark.tags || []);
      fetchTags();
    }
  }, [isOpen, bookmark.tags, fetchTags]);

  const handleToggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;
    setIsCreating(true);
    try {
      await createTag({ name: newTagName.trim() });
      setNewTagName("");
    } catch (error) {
      console.error("Failed to create tag", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const bookmarkId = (bookmark._id || bookmark.id) as string;
      await updateBookmark(bookmarkId, { tags: selectedTagIds });
      onClose();
    } catch (error) {
      console.error("Failed to update tags", error);
      alert("Failed to update tags");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[90vh] w-[95vw] max-w-[400px] flex-col gap-0 overflow-hidden rounded-lg p-0">
        <DialogHeader className="border-b px-4 py-3 sm:px-6 sm:py-4">
          <DialogTitle className="text-base font-medium sm:text-lg">
            Manage Tags
            <p className="text-muted-foreground text-xs font-normal mt-0.5">
              Select tags for this bookmark.
            </p>
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto px-4 py-4 sm:px-6 space-y-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Create new tag..."
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateTag()}
              className="h-9"
            />
            <Button
              size="sm"
              variant="secondary"
              onClick={handleCreateTag}
              disabled={isCreating || !newTagName.trim()}
              className="shrink-0"
            >
              {isCreating ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
            </Button>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Available Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {allTags.length === 0 && (
                <p className="text-xs text-muted-foreground">No tags yet. Create one above!</p>
              )}
              {allTags.map((tag) => {
                const isSelected = selectedTagIds.includes(tag._id);
                const tagColor = getTagColor(tag.name);
                return (
                  <Badge
                    key={tag._id}
                    variant={isSelected ? "default" : "outline"}
                    style={tagColor}
                    className={cn(
                      "cursor-pointer transition-all py-1 px-2.5 flex items-center gap-1.5 border",
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-[var(--tag-bg)] text-[var(--tag-text)] border-[var(--tag-border)] dark:bg-[var(--tag-bg-dark)] dark:text-[var(--tag-text-dark)] hover:brightness-95"
                    )}
                    onClick={() => handleToggleTag(tag._id)}
                  >
                    {tag.name}
                    {isSelected && <Check className="size-3" />}
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter className="border-t px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row gap-2">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={onClose}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
