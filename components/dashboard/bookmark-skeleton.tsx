import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface BookmarkSkeletonProps {
  variant?: "grid" | "list";
}

export function BookmarkSkeleton({ variant = "grid" }: BookmarkSkeletonProps) {
  if (variant === "list") {
    return (
      <div className="flex items-center gap-4 p-4 rounded-lg border bg-card/50">
        <Skeleton className="size-10 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2 min-w-0">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-1/3" />
            <div className="hidden sm:flex gap-1">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex gap-1 shrink-0">
          <Skeleton className="size-8 rounded-md" />
          <Skeleton className="size-8 rounded-md" />
          <Skeleton className="size-8 rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-xl border bg-card/50 overflow-hidden">
      <Skeleton className="h-32 w-full" />
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-5 w-3/4" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="flex flex-wrap gap-1 pt-1">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  );
}

export function BookmarkListSkeleton({ 
  count = 8, 
  variant = "grid" 
}: { 
  count?: number; 
  variant?: "grid" | "list" 
}) {
  return (
    <div className={cn(
      variant === "grid" 
        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        : "flex flex-col gap-2"
    )}>
      {Array.from({ length: count }).map((_, i) => (
        <BookmarkSkeleton key={i} variant={variant} />
      ))}
    </div>
  );
}
