import { create } from "zustand";
import api from "@/lib/axios";
import { gooeyToast } from "@/components/ui/goey-toaster"

export type Bookmark = {
  id: string;
  _id?: string; // For MongoDB
  title: string;
  url: string;
  description: string;
  favicon: string;
  collectionId: string;
  tags: string[];
  createdAt: string;
  isFavorite: boolean;
  status?: "pending" | "processing" | "processed" | "error";
  category?: string;
  isTrashed: boolean;
  isArchived: boolean;
};

export type Collection = {
  _id: string;
  name: string;
  icon: string;
  color: string;
  count?: number;
};

export type Tag = {
  _id: string;
  name: string;
  color: string;
};

type ViewMode = "grid" | "list";
type SortBy = "date-newest" | "date-oldest" | "alpha-az" | "alpha-za";
type FilterType = "all" | "favorites" | "with-tags" | "without-tags";

interface BookmarksState {
  bookmarks: Bookmark[];
  collections: Collection[];
  tags: Tag[];
  isLoading: boolean;
  isCollectionsLoading: boolean;
  isTagsLoading: boolean;
  selectedCollection: string;
  selectedTags: string[];
  searchQuery: string;
  viewMode: ViewMode;
  sortBy: SortBy;
  filterType: FilterType;
  user: any | null;
  lastFetchParams: { isTrashed?: boolean; isArchived?: boolean; isFavorite?: boolean };

  // Actions
  addBookmark: (data: any) => Promise<void>;
  updateBookmark: (id: string, data: any) => Promise<void>;
  deleteBookmark: (id: string) => Promise<void>;
  fetchBookmarks: (params?: { isTrashed?: boolean; isArchived?: boolean; isFavorite?: boolean }, options?: { silent?: boolean }) => Promise<void>;
  fetchCollections: () => Promise<void>;
  fetchTags: () => Promise<void>;
  createTag: (data: { name: string; color?: string }) => Promise<void>;
  updateTag: (id: string, data: { name?: string; color?: string }) => Promise<void>;
  deleteTag: (id: string) => Promise<void>;

  // Collection Actions
  createCollection: (data: { name: string; icon?: string; color?: string }) => Promise<void>;
  updateCollection: (id: string, data: { name?: string; icon?: string; color?: string }) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;

  setSelectedCollection: (collectionId: string) => void;
  toggleTag: (tagId: string) => void;
  clearTags: () => void;
  setSearchQuery: (query: string) => void;
  setViewMode: (mode: ViewMode) => void;
  setSortBy: (sort: SortBy) => void;
  setFilterType: (filter: FilterType) => void;
  setUser: (user: any) => void;
  logout: () => void;
  clearAllFilters: () => void;

  getFilteredBookmarks: () => Bookmark[];
}

export const useBookmarksStore = create<BookmarksState>((set, get) => ({
  bookmarks: [],
  collections: [],
  tags: [],
  isLoading: true,
  isCollectionsLoading: true,
  isTagsLoading: true,
  selectedCollection: "all",
  selectedTags: [],
  searchQuery: "",
  viewMode: "grid",
  sortBy: "date-newest",
  filterType: "all",
  user: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null,
  lastFetchParams: {},

  fetchBookmarks: async (params = {}, options = { silent: false }) => {
    if (!options.silent) set({ isLoading: true });
    try {
      const { isTrashed, isArchived, isFavorite } = params;

      // Save params for silent refreshes
      set({ lastFetchParams: params });

      const response = await api.get("/bookmarks", {
        params: {
          isTrashed,
          isArchived,
          isFavorite,
          collectionId: get().selectedCollection === "all" ? undefined : get().selectedCollection,
          q: get().searchQuery
        },
      });
      set({ bookmarks: response.data, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch bookmarks", error);
      set({ bookmarks: [], isLoading: false });
    }
  },

  updateBookmark: async (id, data) => {
    // Optimistic Update
    const previousBookmarks = get().bookmarks;
    set((state) => ({
      bookmarks: state.bookmarks.map((b) =>
        (b._id === id || b.id === id) ? { ...b, ...data } : b
      )
    }));

    try {
      await api.patch(`/bookmarks/${id}`, data);
      await get().fetchBookmarks(get().lastFetchParams, { silent: true });
      gooeyToast.success("Bookmark updated successfully");
    } catch (error) {
      console.error("Failed to update bookmark", error);
      gooeyToast.error("Failed to update bookmark");
      // Rollback on error
      set({ bookmarks: previousBookmarks });
    }
  },

  deleteBookmark: async (id) => {
    // Optimistic Update
    const previousBookmarks = get().bookmarks;
    set((state) => ({
      bookmarks: state.bookmarks.filter((b) => b._id !== id && b.id !== id)
    }));

    try {
      await api.delete(`/bookmarks/${id}`);
      await get().fetchBookmarks(get().lastFetchParams, { silent: true });
      gooeyToast.success("Bookmark deleted");
    } catch (error) {
      console.error("Failed to delete bookmark", error);
      gooeyToast.error("Failed to delete bookmark");
      // Rollback on error
      set({ bookmarks: previousBookmarks });
    }
  },

  addBookmark: async (data) => {
    try {
      await api.post("/bookmarks", data);
      await get().fetchBookmarks(get().lastFetchParams, { silent: true });
      gooeyToast.success("Bookmark added successfully");
    } catch (error) {
      console.error("Failed to add bookmark", error);
      gooeyToast.error("Failed to add bookmark");
    }
  },

  fetchCollections: async () => {
    set({ isCollectionsLoading: true });
    try {
      const response = await api.get("/collections");
      if (Array.isArray(response.data)) {
        set({ collections: response.data, isCollectionsLoading: false });
      } else {
        set({ collections: [], isCollectionsLoading: false });
      }
    } catch (error) {
      console.error("Failed to fetch collections", error);
      set({ collections: [], isCollectionsLoading: false });
    }
  },

  fetchTags: async () => {
    set({ isTagsLoading: true });
    try {
      const response = await api.get("/tags");
      if (Array.isArray(response.data)) {
        set({ tags: response.data, isTagsLoading: false });
      } else {
        set({ tags: [], isTagsLoading: false });
      }
    } catch (error) {
      console.error("Failed to fetch tags", error);
      set({ tags: [], isTagsLoading: false });
    }
  },

  createTag: async (data) => {
    try {
      await api.post("/tags", data);
      await get().fetchTags();
      gooeyToast.success("Tag created");
    } catch (error) {
      console.error("Failed to create tag", error);
      gooeyToast.error("Failed to create tag");
    }
  },

  updateTag: async (id, data) => {
    try {
      await api.patch(`/tags/${id}`, data);
      await get().fetchTags();
      await get().fetchBookmarks(get().lastFetchParams, { silent: true });
      gooeyToast.success("Tag updated");
    } catch (error) {
      console.error("Failed to update tag", error);
      gooeyToast.error("Failed to update tag");
    }
  },

  deleteTag: async (id) => {
    try {
      await api.delete(`/tags/${id}`);
      await get().fetchTags();
      await get().fetchBookmarks(get().lastFetchParams, { silent: true });
      gooeyToast.success("Tag deleted");
    } catch (error) {
      console.error("Failed to delete tag", error);
      gooeyToast.error("Failed to delete tag");
    }
  },

  createCollection: async (data) => {
    try {
      await api.post("/collections", data);
      await get().fetchCollections();
      gooeyToast.success("Collection created");
    } catch (error) {
      console.error("Failed to create collection", error);
      gooeyToast.error("Failed to create collection");
    }
  },

  updateCollection: async (id, data) => {
    try {
      await api.patch(`/collections/${id}`, data);
      await get().fetchCollections();
      gooeyToast.success("Collection updated");
    } catch (error) {
      console.error("Failed to update collection", error);
      gooeyToast.error("Failed to update collection");
    }
  },

  deleteCollection: async (id) => {
    try {
      await api.delete(`/collections/${id}`);
      if (get().selectedCollection === id) {
        set({ selectedCollection: "all" });
      }
      await get().fetchCollections();
      await get().fetchBookmarks(get().lastFetchParams, { silent: true });
      gooeyToast.success("Collection deleted");
    } catch (error) {
      console.error("Failed to delete collection", error);
      gooeyToast.error("Failed to delete collection");
    }
  },

  setSelectedCollection: (collectionId) => {
    set({ selectedCollection: collectionId, searchQuery: "", selectedTags: [] });
    get().fetchBookmarks({ isTrashed: false, isArchived: false });
  },

  toggleTag: (tagId) =>
    set((state) => ({
      selectedTags: state.selectedTags.includes(tagId)
        ? state.selectedTags.filter((t) => t !== tagId)
        : [...state.selectedTags, tagId],
    })),

  clearTags: () => set({ selectedTags: [] }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setViewMode: (mode) => set({ viewMode: mode }),

  setSortBy: (sort) => set({ sortBy: sort }),

  setFilterType: (filter) => set({ filterType: filter }),

  setUser: (user) => {
    set({ user });
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout API failed", error);
    }

    set({ user: null, bookmarks: [], collections: [], tags: [] });
    localStorage.removeItem("user");

    // Also clear client-side accessible cookies just in case
    import("js-cookie").then((Cookies) => {
      Cookies.default.remove("accessToken");
    });

    window.location.href = "/login";
  },

  clearAllFilters: () => {
    set({
      selectedTags: [],
      filterType: "all",
      searchQuery: "",
      sortBy: "date-newest",
    });
    get().fetchBookmarks({}, { silent: true });
  },

  getFilteredBookmarks: () => {
    const state = get();
    if (!Array.isArray(state.bookmarks)) return [];

    // Default filter: exclude trashed and archived bookmarks from main dashboard view
    let filtered = state.bookmarks.filter(b => b && !b.isTrashed && !b.isArchived);

    if (state.selectedCollection !== "all") {
      filtered = filtered.filter((b) => b && b.collectionId === state.selectedCollection);
    }

    if (state.selectedTags.length > 0) {
      filtered = filtered.filter((b) =>
        b && b.tags?.some((tag: string) => state.selectedTags.includes(tag))
      );
    }

    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (b) => {
          if (!b) return false;

          // Check title, description, url
          const matchesText = b.title?.toLowerCase()?.includes(query) ||
            b.description?.toLowerCase()?.includes(query) ||
            b.url?.toLowerCase()?.includes(query);

          if (matchesText) return true;

          // Check tag names
          const matchesTags = b.tags?.some(tagId => {
            const tag = state.tags.find(t => t._id === tagId);
            return tag?.name?.toLowerCase()?.includes(query);
          });

          return matchesTags;
        }
      );
    }

    switch (state.filterType) {
      case "favorites":
        filtered = filtered.filter((b) => b?.isFavorite);
        break;
      case "with-tags":
        filtered = filtered.filter((b) => (b?.tags?.length || 0) > 0);
        break;
      case "without-tags":
        filtered = filtered.filter((b) => (b?.tags?.length || 0) === 0);
        break;
    }

    switch (state.sortBy) {
      case "date-newest":
        filtered.sort((a, b) => new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime());
        break;
      case "date-oldest":
        filtered.sort((a, b) => new Date(a?.createdAt || 0).getTime() - new Date(b?.createdAt || 0).getTime());
        break;
      case "alpha-az":
        filtered.sort((a, b) => (a?.title || "").localeCompare(b?.title || ""));
        break;
      case "alpha-za":
        filtered.sort((a, b) => (b?.title || "").localeCompare(a?.title || ""));
        break;
    }

    return filtered;
  },
}));
