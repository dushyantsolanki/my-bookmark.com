"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tag as TagIcon, Plus, X, Loader2, Pencil, Trash2, Check } from "lucide-react";
import { useBookmarksStore, type Tag } from "@/store/bookmarks-store";
import { cn, getTagColor } from "@/lib/utils";

interface ManageAllTagsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ManageAllTagsModal({ isOpen, onClose }: ManageAllTagsModalProps) {
  const { tags, createTag, updateTag, deleteTag } = useBookmarksStore();
  const [newTagName, setNewTagName] = useState("");
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editingTagName, setEditingTagName] = useState("");
  const [loading, setLoading] = useState<string | null>(null); // 'create' or tagId

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;
    setLoading("create");
    try {
      await createTag({ name: newTagName.trim() });
      setNewTagName("");
    } catch (error) {
      console.error("Failed to create tag", error);
    } finally {
      setLoading(null);
    }
  };

  const handleStartEdit = (tag: Tag) => {
    setEditingTagId(tag._id);
    setEditingTagName(tag.name);
  };

  const handleSaveEdit = async (tagId: string) => {
    if (!editingTagName.trim()) return;
    setLoading(tagId);
    try {
      await updateTag(tagId, { name: editingTagName.trim() });
      setEditingTagId(null);
    } catch (error) {
      console.error("Failed to update tag", error);
    } finally {
      setLoading(null);
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    setLoading(tagId);
    try {
      await deleteTag(tagId);
    } catch (error) {
      console.error("Failed to delete tag", error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[90vh] w-[95vw] max-w-[500px] flex-col gap-0 overflow-hidden rounded-lg p-0">
        <DialogHeader className="border-b px-4 py-3 sm:px-6 sm:py-4">
          <DialogTitle className="text-base font-medium sm:text-lg">
            Manage All Tags
            <p className="text-muted-foreground text-xs font-normal mt-0.5">
              Create, edit, or delete your bookmark tags.
            </p>
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto px-4 py-4 sm:px-6 space-y-6">
          {/* Create New Tag */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Create New Tag
            </h4>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Tag name..."
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateTag()}
                className="h-9"
              />
              <Button
                size="sm"
                onClick={handleCreateTag}
                disabled={loading === "create" || !newTagName.trim()}
                className="shrink-0"
              >
                {loading === "create" ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4 " />}
                Create
              </Button>
            </div>
          </div>

          {/* Tag List */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Existing Tags ({tags.length})
            </h4>
            <div className="grid gap-2">
              {tags.length === 0 && (
                <p className="text-sm text-muted-foreground py-4 text-center border rounded-lg border-dashed">
                  No tags found. Start by creating one above!
                </p>
              )}
              {tags.map((tag) => {
                const tagColor = getTagColor(tag.name);
                return (
                  <div
                    key={tag._id}
                    className="flex items-center justify-between p-2 rounded-lg border bg-card hover:bg-accent/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        style={tagColor}
                        className="size-7 rounded-md flex items-center justify-center bg-[var(--tag-bg)] border-[var(--tag-border)] border"
                      >
                        <TagIcon className="size-3.5 text-[var(--tag-text)] dark:text-[var(--tag-text-dark)]" />
                      </div>
                      {editingTagId === tag._id ? (
                        <Input
                          value={editingTagName}
                          onChange={(e) => setEditingTagName(e.target.value)}
                          className="h-8 py-0 flex-1 mr-4"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveEdit(tag._id);
                            if (e.key === "Escape") setEditingTagId(null);
                          }}
                        />
                      ) : (
                        <span className="text-sm font-medium">{tag.name}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                      {editingTagId === tag._id ? (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-8 bg-emerald-500/10 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50"
                            onClick={() => handleSaveEdit(tag._id)}
                            disabled={loading === tag._id}
                          >
                            {loading === tag._id ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-8 bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-600"
                            onClick={() => setEditingTagId(null)}
                          >
                            <X className="size-3.5" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-8 text-muted-foreground hover:text-foreground"
                            onClick={() => handleStartEdit(tag)}
                          >
                            <Pencil className="size-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                            onClick={() => handleDeleteTag(tag._id)}
                            disabled={loading === tag._id}
                          >
                            {loading === tag._id ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter className="border-t px-4 py-3 sm:px-6 sm:py-4">
          <DialogClose asChild>
            <Button variant="secondary" className="w-full sm:w-auto">
              Done
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
