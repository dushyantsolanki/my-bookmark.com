import * as React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { useBookmarksStore } from "@/store/bookmarks-store";
import {
  Folder,
  Palette,
  Code,
  Wrench,
  BookOpen,
  Sparkles,
  Bookmark,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

const collectionIcons = [
  { name: "Folder", icon: Folder },
  { name: "Bookmark", icon: Bookmark },
  { name: "Palette", icon: Palette },
  { name: "Code", icon: Code },
  { name: "Wrench", icon: Wrench },
  { name: "BookOpen", icon: BookOpen },
  { name: "Sparkles", icon: Sparkles },
];

const colors = [
  "#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#6366f1"
];

interface ManageCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectionId?: string; // If provided, we are editing
}

export function ManageCollectionModal({
  isOpen,
  onClose,
  collectionId,
}: ManageCollectionModalProps) {
  const { collections, createCollection, updateCollection, deleteCollection } = useBookmarksStore();
  const editingCollection = collectionId
    ? collections.find(c => c._id === collectionId)
    : null;

  const formik = useFormik({
    initialValues: {
      name: editingCollection?.name || "",
      icon: editingCollection?.icon || "Folder",
      color: editingCollection?.color || "#3b82f6",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required("Collection name is required"),
      icon: Yup.string().required("Icon is required"),
      color: Yup.string().required("Color is required"),
    }),
    onSubmit: async (values) => {
      if (editingCollection) {
        await updateCollection(editingCollection._id, values);
      } else {
        await createCollection(values);
      }
      formik.resetForm();
      onClose();
    },
  });

  const handleDelete = async () => {
    if (editingCollection) {
      await deleteCollection(editingCollection._id);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingCollection ? "Edit Collection" : "Create New Collection"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6 pt-4">
          <FieldGroup>
            <FieldLabel>Name</FieldLabel>
            <Input
              name="name"
              placeholder="e.g. Work, Design, Personal"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.name && formik.errors.name && (
              <FieldError>{formik.errors.name}</FieldError>
            )}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>Icon</FieldLabel>
            <div className="grid grid-cols-7 gap-2">
              {collectionIcons.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => formik.setFieldValue("icon", item.name)}
                  className={cn(
                    "flex items-center justify-center size-10 rounded-md border transition-all",
                    formik.values.icon === item.name
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:bg-muted"
                  )}
                >
                  <item.icon className="size-5" />
                </button>
              ))}
            </div>
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>Color</FieldLabel>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => formik.setFieldValue("color", color)}
                  className={cn(
                    "size-8 rounded-full border-2 transition-all",
                    formik.values.color === color
                      ? "border-foreground"
                      : "border-transparent"
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </FieldGroup>

          <DialogFooter className="flex items-center justify-between sm:justify-between w-full pt-4">
            {editingCollection ? (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
              >
                Delete
              </Button>
            ) : <div />}

            <div className="flex gap-2">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={formik.isSubmitting}>
                {editingCollection ? "Save Changes" : "Create Collection"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
