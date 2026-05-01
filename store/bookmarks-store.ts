import { create } from "zustand";
import api from "@/lib/axios";

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
  selectedCollection: string;
  selectedTags: string[];
  searchQuery: string;
  viewMode: ViewMode;
  sortBy: SortBy;
  filterType: FilterType;
  user: any | null;

  // Actions
  addBookmark: (data: any) => Promise<void>;
  updateBookmark: (id: string, data: any) => Promise<void>;
  deleteBookmark: (id: string) => Promise<void>;
  fetchBookmarks: (params?: { isTrashed?: boolean; isArchived?: boolean; isFavorite?: boolean }) => Promise<void>;
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

  getFilteredBookmarks: () => Bookmark[];
}

export const useBookmarksStore = create<BookmarksState>((set, get) => ({
  bookmarks: [],
  collections: [],
  tags: [],
  isLoading: false,
  selectedCollection: "all",
  selectedTags: [],
  searchQuery: "",
  viewMode: "grid",
  sortBy: "date-newest",
  filterType: "all",
  user: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null,

  fetchBookmarks: async (params = {}) => {
    set({ isLoading: true });
    try {
      const userId = get().user?.id || get().user?._id;
      const { isTrashed, isArchived, isFavorite } = params;

      const response = await api.get("/bookmarks", {
        params: {
          userId,
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
    try {
      await api.patch(`/bookmarks/${id}`, data);
      await get().fetchBookmarks();
    } catch (error) {
      console.error("Failed to update bookmark", error);
    }
  },

  deleteBookmark: async (id) => {
    try {
      await api.delete(`/bookmarks/${id}`);
      await get().fetchBookmarks();
    } catch (error) {
      console.error("Failed to delete bookmark", error);
    }
  },

  addBookmark: async (data) => {
    try {
      await api.post("/bookmarks", data);
      await get().fetchBookmarks();
    } catch (error) {
      console.error("Failed to add bookmark", error);
    }
  },

  fetchCollections: async () => {
    const userId = get().user?.id || get().user?._id || "64f1a2b3c4d5e6f7a8b9c0d1";
    try {
      const response = await api.get(`/collections?userId=${userId}`);
      if (Array.isArray(response.data)) {
        set({ collections: response.data });
      } else {
        set({ collections: [] });
      }
    } catch (error) {
      console.error("Failed to fetch collections", error);
      set({ collections: [] });
    }
  },

  fetchTags: async () => {
    const userId = get().user?.id || get().user?._id || "64f1a2b3c4d5e6f7a8b9c0d1";
    try {
      const response = await api.get(`/tags?userId=${userId}`);
      if (Array.isArray(response.data)) {
        set({ tags: response.data });
      } else {
        set({ tags: [] });
      }
    } catch (error) {
      console.error("Failed to fetch tags", error);
      set({ tags: [] });
    }
  },

  createTag: async (data) => {
    const userId = get().user?.id || get().user?._id;
    try {
      await api.post("/tags", { ...data, userId });
      await get().fetchTags();
    } catch (error) {
      console.error("Failed to create tag", error);
    }
  },

  updateTag: async (id, data) => {
    try {
      await api.patch(`/tags/${id}`, data);
      await get().fetchTags();
      await get().fetchBookmarks(); // Refresh bookmarks as they might have had this tag
    } catch (error) {
      console.error("Failed to update tag", error);
    }
  },

  deleteTag: async (id) => {
    try {
      await api.delete(`/tags/${id}`);
      await get().fetchTags();
      await get().fetchBookmarks(); // Refresh bookmarks as they might have had this tag
    } catch (error) {
      console.error("Failed to delete tag", error);
    }
  },

  createCollection: async (data) => {
    const userId = get().user?.id || get().user?._id;
    try {
      await api.post("/collections", { ...data, userId });
      await get().fetchCollections();
    } catch (error) {
      console.error("Failed to create collection", error);
    }
  },

  updateCollection: async (id, data) => {
    try {
      await api.patch(`/collections/${id}`, data);
      await get().fetchCollections();
    } catch (error) {
      console.error("Failed to update collection", error);
    }
  },

  deleteCollection: async (id) => {
    try {
      await api.delete(`/collections/${id}`);
      if (get().selectedCollection === id) {
        set({ selectedCollection: "all" });
      }
      await get().fetchCollections();
      await get().fetchBookmarks(); // Refresh bookmarks as they might have changed collection
    } catch (error) {
      console.error("Failed to delete collection", error);
    }
  },

  setSelectedCollection: (collectionId) => {
    set({ selectedCollection: collectionId });
    get().fetchBookmarks();
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
      Cookies.default.remove("refreshToken");
    });

    window.location.href = "/login";
  },

  getFilteredBookmarks: () => {
    const state = get();
    let filtered = [...state.bookmarks];

    if (state.selectedCollection !== "all") {
      filtered = filtered.filter((b) => b.collectionId === state.selectedCollection);
    }

    if (state.selectedTags.length > 0) {
      filtered = filtered.filter((b) =>
        state.selectedTags.some((tag) => b.tags.includes(tag))
      );
    }

    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.title?.toLowerCase()?.includes(query) ||
          b.description?.toLowerCase()?.includes(query) ||
          b.url?.toLowerCase()?.includes(query)
      );
    }

    switch (state.filterType) {
      case "favorites":
        filtered = filtered.filter((b) => b.isFavorite);
        break;
      case "with-tags":
        filtered = filtered.filter((b) => b.tags.length > 0);
        break;
      case "without-tags":
        filtered = filtered.filter((b) => b.tags.length === 0);
        break;
    }

    switch (state.sortBy) {
      case "date-newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "date-oldest":
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "alpha-az":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "alpha-za":
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }

    return filtered;
  },
}));
