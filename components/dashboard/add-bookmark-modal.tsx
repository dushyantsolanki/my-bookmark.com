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
  Globe,
  FileText,
  Folder,
  Tag,
  Star,
  Loader2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBookmarksStore } from "@/store/bookmarks-store";
import api from "@/lib/axios";

interface AddBookmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddBookmarkModal = ({ isOpen, onClose }: AddBookmarkModalProps) => {
  const { collections, fetchBookmarks, user } = useBookmarksStore();
  const [loading, setLoading] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      url: "",
      title: "",
      description: "",
      collectionId: "all",
      isFavorite: false,
    },
    validationSchema: Yup.object({
      url: Yup.string().url("Invalid URL").required("URL is required"),
      title: Yup.string().required("Title is required"),
      description: Yup.string().optional(),
      collectionId: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const userId = user?.id || user?._id || "64f1a2b3c4d5e6f7a8b9c0d1";
        const response = await api.post("/bookmarks/add", {
          ...values,
          userId,
        });

        if (response.status === 201 || response.status === 200) {
          await fetchBookmarks();
          formik.resetForm();
          onClose();
        }
      } catch (error: any) {
        console.error("Submission error:", error);
        alert(error.response?.data?.error || "Failed to add bookmark");
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
            Add New Bookmark
            <p className="text-muted-foreground text-xs font-normal mt-0.5">
              Enter the URL and details to save your bookmark.
            </p>
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto px-4 py-4 sm:px-6">
          <form
            id="bookmark-form"
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
              autoFocus
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
            form="bookmark-form"
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Bookmark"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { AddBookmarkModal };
export default AddBookmarkModal;
