"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, getTagColor } from "@/lib/utils";
import {
  LayoutGrid,
  Bookmark,
  ChevronDown,
  ChevronRight,
  Search,
  Folder,
  Star,
  Code,
  Palette,
  Wrench,
  BookOpen,
  Sparkles,
  Tag,
  Archive,
  Trash2,
  Plus,
  Settings,
  X,
  LayoutGridIcon
} from "lucide-react";
import { ManageCollectionModal } from "./manage-collection-modal";
import { ManageAllTagsModal } from "./manage-all-tags-modal";
import { useBookmarksStore } from "@/store/bookmarks-store";

const collectionIcons: Record<string, React.ElementType> = {
  Folder: Folder,
  Bookmark: Bookmark,
  Palette: Palette,
  Code: Code,
  Wrench: Wrench,
  BookOpen: BookOpen,
  Sparkles: Sparkles,
};

const navItems = [
  { icon: LayoutGridIcon, label: "Dashboard", href: "/" },
  { icon: Star, label: "Favorites", href: "/favorites" },
  { icon: Archive, label: "Archive", href: "/archive" },
  { icon: Trash2, label: "Trash", href: "/trash" },
];

export function BookmarksSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const [collectionsOpen, setCollectionsOpen] = React.useState(true);
  const [tagsOpen, setTagsOpen] = React.useState(true);
  const {
    selectedCollection,
    setSelectedCollection,
    selectedTags,
    toggleTag,
    clearTags,
    collections,
    tags,
    fetchCollections,
    fetchTags,
    searchQuery,
    setSearchQuery,
    setFilterType,
    isLoading,
    isCollectionsLoading,
    isTagsLoading,
  } = useBookmarksStore();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingCollectionId, setEditingCollectionId] = React.useState<string | undefined>();
  const [isTagsModalOpen, setIsTagsModalOpen] = React.useState(false);

  React.useEffect(() => {
    fetchCollections();
    fetchTags();
  }, [fetchCollections, fetchTags]);

  const handleAddCollection = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCollectionId(undefined);
    setIsModalOpen(true);
  };

  const handleEditCollection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingCollectionId(id);
    setIsModalOpen(true);
  };

  const isHomePage = pathname === "/";

  return (
    <>
      <Sidebar collapsible="offcanvas" className="lg:border-r-0!" {...props}>
        <SidebarHeader className="p-5 pb-0">
          <div className="flex items-center gap-2 px-1">
            <div className="size-7 rounded-lg overflow-hidden shadow-sm">
              <img src="/logo.png" alt="MyBookmark Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-lg tracking-tight">MyBookmark</span>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-5 pt-5">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search Bookmarks..."
              className="pl-9 pr-10 h-9 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-10 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="size-3.5" />
              </button>
            )}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-muted px-1.5 py-0.5 rounded text-[11px] text-muted-foreground font-medium">
              ⌘K
            </div>
          </div>

          <SidebarGroup className="p-0">
            <SidebarGroupLabel className="flex items-center gap-1.5 px-0 text-[10px] font-semibold tracking-wider text-muted-foreground">
              <button
                onClick={() => setCollectionsOpen(!collectionsOpen)}
                className="flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronDown
                  className={cn(
                    "size-3.5 transition-transform",
                    !collectionsOpen && "-rotate-90"
                  )}
                />
                COLLECTIONS
              </button>
              <button
                onClick={handleAddCollection}
                className="ml-auto p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <Plus className="size-3.5" />
              </button>
            </SidebarGroupLabel>
            {collectionsOpen && (
              <SidebarGroupContent>
                <SidebarMenu className="mt-2">
                  {isCollectionsLoading && collections.length === 0 ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <SidebarMenuItem key={i}>
                        <div className="flex items-center gap-3 px-3 py-2">
                          <Skeleton className="size-4 rounded" />
                          <Skeleton className="h-4 flex-1" />
                        </div>
                      </SidebarMenuItem>
                    ))
                  ) : (
                    Array.isArray(collections) && collections.map((collection) => {
                      const IconComponent =
                        collectionIcons[collection.icon] || Folder;
                      const isHomePage = pathname === "/";
                      const isActive =
                        isHomePage && selectedCollection === collection._id;
                      return (
                        <SidebarMenuItem key={collection._id}>
                          <SidebarMenuButton
                            asChild
                            isActive={isActive}
                            className="h-[38px]"
                          >
                            <Link
                              href="/"
                              onClick={() => {
                                setSelectedCollection(collection._id);
                                clearTags();
                              }}
                            >
                              <IconComponent className="size-5" style={{ color: collection.color }} />
                              <span className="flex-1 capitalize">{collection.name}</span>
                              {collection.count !== undefined && (
                                <span className="text-muted-foreground text-xs group-hover:hidden">
                                  {collection.count}
                                </span>
                              )}
                              <button
                                onClick={(e) => handleEditCollection(e, collection._id)}
                                className="hidden group-hover:flex size-6 items-center justify-center rounded-md hover:bg-muted-foreground/10 text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <Settings className="size-3.5" />
                              </button>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            )}
          </SidebarGroup>

          <ManageCollectionModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            collectionId={editingCollectionId}
          />

          <SidebarGroup className="p-0">
            <SidebarGroupLabel className="flex items-center gap-1.5 px-0 text-[10px] font-semibold tracking-wider text-muted-foreground">
              <button
                onClick={() => setTagsOpen(!tagsOpen)}
                className="flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronDown
                  className={cn(
                    "size-3.5 transition-transform",
                    !tagsOpen && "-rotate-90"
                  )}
                />
                TAGS
              </button>
              {selectedTags.length > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearTags();
                  }}
                  className="ml-auto text-[10px] text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => setIsTagsModalOpen(true)}
                className={cn(
                  "p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors",
                  selectedTags.length === 0 && "ml-auto"
                )}
              >
                <Settings className="size-3.5" />
              </button>
            </SidebarGroupLabel>
            {tagsOpen && (
              <SidebarGroupContent>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {isTagsLoading && tags.length === 0 ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="h-6 w-16 rounded-md" />
                    ))
                  ) : (
                    Array.isArray(tags) && tags.map((tag) => {
                      const tagColor = getTagColor(tag.name);
                      const isSelected = selectedTags.includes(tag._id);
                      return (
                        <button
                          key={tag._id}
                          onClick={() => toggleTag(tag._id)}
                          style={tagColor}
                          className={cn(
                            "inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-all duration-200 border",
                            isSelected
                              ? "bg-primary text-primary-foreground border-primary shadow-sm scale-105"
                              : "bg-[var(--tag-bg)] text-[var(--tag-text)] border-[var(--tag-border)] dark:bg-[var(--tag-bg-dark)] dark:text-[var(--tag-text-dark)] hover:brightness-95"
                          )}
                        >
                          <Tag className={cn("size-3", !isSelected && "opacity-70")} />
                          <span className="capitalize">{tag.name}</span>
                        </button>
                      );
                    })
                  )}
                </div>
              </SidebarGroupContent>
            )}
          </SidebarGroup>

          <SidebarGroup className="p-0">
            <SidebarGroupContent>
              <SidebarMenu className="mt-2">
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      className="h-[38px]"
                    >
                      <Link
                        href={item.href}
                        onClick={() => {
                          if (item.href === "/") {
                            setSelectedCollection("all");
                            setFilterType("all");
                            clearTags();
                          }
                        }}
                      >
                        <item.icon className="size-5" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="px-5 pb-5">
          <div className="flex items-center justify-between px-1 py-2 border-t border-border/50">
            <span className="text-[10px] text-muted-foreground font-medium">© 2025 MyBookmarks</span>
            <div className="flex items-center gap-2">
              <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-muted-foreground">Online</span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <ManageAllTagsModal
        isOpen={isTagsModalOpen}
        onClose={() => setIsTagsModalOpen(false)}
      />
    </>
  );
}
