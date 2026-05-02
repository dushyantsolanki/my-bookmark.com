import { BookmarksSidebar } from "@/components/dashboard/sidebar";
import { BookmarksHeader } from "@/components/dashboard/header";
import { ProfileContent } from "@/components/dashboard/profile-content";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile - MyBookmark",
  description: "Manage your personal information and account settings.",
};

export default function ProfilePage() {
  return (
    <SidebarProvider className="bg-sidebar">
      <BookmarksSidebar />
      <div className="h-svh overflow-hidden lg:p-2 w-full">
        <div className="lg:border lg:rounded-md overflow-hidden flex flex-col items-center justify-start bg-container h-full w-full bg-background">
          <BookmarksHeader title="User Profile" />
          <ProfileContent />
        </div>
      </div>
    </SidebarProvider>
  );
}
