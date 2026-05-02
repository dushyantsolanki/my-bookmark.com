"use client";

import * as React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import {
  Search,
  LayoutGrid,
  List,
  Plus,
  SlidersHorizontal,
  ArrowUpDown,
  User,
  Settings,
  LogOut,
  Check,
} from "lucide-react";
import { useBookmarksStore } from "@/store/bookmarks-store";
import { cn } from "@/lib/utils";
import { AddBookmarkModal } from "./add-bookmark-modal";

interface BookmarksHeaderProps {
  title?: string;
}

const sortOptions = [
  { value: "date-newest", label: "Date Added (Newest)" },
  { value: "date-oldest", label: "Date Added (Oldest)" },
  { value: "alpha-az", label: "Alphabetical (A-Z)" },
  { value: "alpha-za", label: "Alphabetical (Z-A)" },
] as const;

const filterOptions = [
  { value: "all", label: "All Bookmarks" },
  { value: "favorites", label: "Favorites Only" },
  { value: "with-tags", label: "With Tags" },
  { value: "without-tags", label: "Without Tags" },
] as const;

export function BookmarksHeader({ title = "Bookmarks" }: BookmarksHeaderProps) {
  const {
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filterType,
    setFilterType,
    user,
    logout,
    fetchBookmarks
  } = useBookmarksStore();
  const pathname = usePathname();

  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [localSearch, setLocalSearch] = React.useState("");
  const [mounted, setMounted] = React.useState(false);

  // Set mounted and sync initial search query
  React.useEffect(() => {
    setMounted(true);
    setLocalSearch(searchQuery);
  }, []);

  // Sync with store if changed externally (e.g. Clear All)
  React.useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  // Debounce search query
  React.useEffect(() => {
    if (!mounted) return;

    const timer = setTimeout(() => {
      if (localSearch !== searchQuery) {
        setSearchQuery(localSearch);
        fetchBookmarks({}, { silent: true });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearch, mounted, setSearchQuery, fetchBookmarks, searchQuery]);

  const currentSort = sortOptions.find((opt) => opt.value === sortBy);
  const currentFilter = filterOptions.find((opt) => opt.value === filterType);

  const getDisplayTitle = () => {
    if (pathname === "/") return "All Bookmarks";
    if (pathname === "/favorites") return "Favorites";
    if (pathname === "/archive") return "Archive";
    if (pathname === "/trash") return "Trash";
    if (pathname === "/profile") return "Profile Settings";
    return title;
  };

  if (!mounted) {
    return (
      <header className="w-full border-b">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-5" />
            <h1 className="text-base font-semibold hidden sm:block">{getDisplayTitle()}</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-full bg-muted animate-pulse" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="w-full border-b">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-5" />
          <h1 className="text-base font-semibold hidden sm:block">{getDisplayTitle()}</h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by title or tags..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-9 w-64 h-9"
            />
          </div>

          <div className="flex items-center border rounded-md p-0.5">
            <Button
              variant="ghost"
              size="icon-xs"
              className={cn("rounded-sm", viewMode === "grid" && "bg-muted")}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              className={cn("rounded-sm", viewMode === "list" && "bg-muted")}
              onClick={() => setViewMode("list")}
            >
              <List className="size-4" />
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <ArrowUpDown className="size-4" />
                <span className="hidden lg:inline">{currentSort?.label.split(" ")[0]}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Sort by
              </DropdownMenuLabel>
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className="flex items-center justify-between"
                >
                  {option.label}
                  {sortBy === option.value && <Check className="size-4" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "hidden sm:flex",
                  filterType !== "all" && "border-primary text-primary"
                )}
              >
                <SlidersHorizontal className="size-4" />
                <span className="hidden lg:inline">
                  {filterType !== "all" ? currentFilter?.label : "Filter"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Filter by
              </DropdownMenuLabel>
              {filterOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setFilterType(option.value)}
                  className="flex items-center justify-between"
                >
                  {option.label}
                  {filterType === option.value && <Check className="size-4" />}
                </DropdownMenuItem>
              ))}
              {filterType !== "all" && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setFilterType("all")}
                    className="text-muted-foreground"
                  >
                    Clear filter
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            size="sm"
            className="hidden sm:flex"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="size-4" />
            Add Bookmark
          </Button>

          <Separator orientation="vertical" className="h-5 hidden sm:block" />

          <ThemeToggle />

          <div className="flex items-center gap-3 pl-2 border-l ml-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-auto p-1 flex items-center gap-3 hover:bg-muted/50 transition-colors">
                  <Avatar className="size-8 ring-1 ring-border">
                    <AvatarImage src={user?.image || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.name || "Lndev"}`} />
                    <AvatarFallback>{user?.name?.slice(0, 2).toUpperCase() || "LN"}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left hidden lg:flex">
                    <span className="text-sm font-semibold leading-tight">{user?.name || "Lndev"}</span>
                    <span className="text-[11px] text-muted-foreground font-medium">{user?.email || "lndev@example.com"}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name || "Lndev"}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email || "lndev@example.com"}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => window.location.href = "/profile"} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                {/* <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer"
                  onClick={() => logout()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <AddBookmarkModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </header>
  );
}
