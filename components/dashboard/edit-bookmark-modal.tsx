"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { XInputField } from "@/components/custom/XInputField";
import {
  Link as LinkIcon,
  FileText,
  Star,
  Loader2,
  Tag as TagIcon,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn, getTagColor } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBookmarksStore, type Bookmark } from "@/store/bookmarks-store";

interface EditBookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmark: Bookmark;
}

const EditBookmarkModal = ({ isOpen, onClose, bookmark }: EditBookmarkModalProps) => {
  const { collections, updateBookmark } = useBookmarksStore();
  const [loading, setLoading] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      url: bookmark.url || "",
      title: bookmark.title || "",
      description: bookmark.description || "",
      collectionId: bookmark.collectionId || "all",
      isFavorite: bookmark.isFavorite || false,
      tags: bookmark.tags || [],
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      url: Yup.string().url("Invalid URL").required("URL is required"),
      title: Yup.string().required("Title is required"),
      description: Yup.string().optional(),
      collectionId: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const bookmarkId = (bookmark._id || bookmark.id) as string;
        const submitValues = {
          ...values,
          collectionId: values.collectionId === "all" ? null : values.collectionId
        };
        await updateBookmark(bookmarkId, submitValues);
        onClose();
      } catch (error: any) {
        console.error("Update error:", error);
        alert("Failed to update bookmark");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[90vh] w-[95vw] max-w-[500px] flex-col gap-0 overflow-hidden rounded-lg p-0">
        <DialogHeader className="border-b px-4 py-3 sm:px-6 sm:py-4">
          <DialogTitle className="text-base font-medium sm:text-lg">
            Edit Bookmark
            <p className="text-muted-foreground text-xs font-normal mt-0.5">
              Update the details of your bookmark.
            </p>
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto px-4 py-4 sm:px-6">
          <form
            id="edit-bookmark-form"
            onSubmit={formik.handleSubmit}
            className="grid grid-cols-1 gap-4"
          >
            <XInputField
              id="url"
              name="url"
              label="URL"
              placeholder="https://example.com"
              icon={<LinkIcon />}
              value={formik.values.url}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.url && formik.errors.url}
            />

            <XInputField
              id="title"
              name="title"
              label="Bookmark Title"
              placeholder="e.g. My Favorite Article"
              icon={<FileText />}
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && formik.errors.title}
            />

            <div className="flex flex-col space-y-1.5">
              <label htmlFor="collectionId" className="text-sm font-medium">
                Collection
              </label>
              <Select
                onValueChange={(value) => formik.setFieldValue("collectionId", value)}
                value={formik.values.collectionId}
              >
                <SelectTrigger id="collectionId" className="w-full">
                  <SelectValue placeholder="Select a collection" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Uncategorized</SelectItem>
                  {collections.map((collection) => (
                    <SelectItem key={collection._id} value={collection._id}>
                      {collection.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.collectionId && formik.errors.collectionId && (
                <p className="text-xs text-red-500 font-medium">
                  {formik.errors.collectionId}
                </p>
              )}
            </div>

            <div className="flex flex-col space-y-1.5">
              <label htmlFor="description" className="text-sm font-medium">
                Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Add a brief description..."
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={formik.values.isFavorite ? "text-amber-500 hover:text-amber-600" : "text-muted-foreground"}
                onClick={() => formik.setFieldValue("isFavorite", !formik.values.isFavorite)}
              >
                <Star className={formik.values.isFavorite ? "fill-current mr-2 h-4 w-4" : "mr-2 h-4 w-4"} />
                {formik.values.isFavorite ? "Favorited" : "Mark as Favorite"}
              </Button>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <TagIcon className="size-4" />
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {useBookmarksStore.getState().tags.map((tag) => {
                  const isSelected = formik.values.tags.includes(tag._id);
                  const tagColor = getTagColor(tag.name);
                  return (
                    <Badge
                      key={tag._id}
                      variant={isSelected ? "default" : "outline"}
                      style={tagColor}
                      className={cn(
                        "cursor-pointer py-1 px-2.5 flex items-center gap-1.5 transition-all border",
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-[var(--tag-bg)] text-[var(--tag-text)] border-[var(--tag-border)] dark:bg-[var(--tag-bg-dark)] dark:text-[var(--tag-text-dark)] hover:brightness-95"
                      )}
                      onClick={() => {
                        const newTags = isSelected
                          ? formik.values.tags.filter((id: string) => id !== tag._id)
                          : [...formik.values.tags, tag._id];
                        formik.setFieldValue("tags", newTags);
                      }}
                    >
                      <TagIcon className="size-3 shrink-0" />
                      {tag.name}
                      {isSelected && <Check className="size-3" />}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </form>
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
            type="submit"
            form="edit-bookmark-form"
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Bookmark"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { EditBookmarkModal };
export default EditBookmarkModal;
