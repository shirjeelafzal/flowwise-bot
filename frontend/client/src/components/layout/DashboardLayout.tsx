import { type ReactNode } from "react";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useView } from "@/hooks/use-view";
import ViewToggle from "@/components/shared/ViewToggle";
import SidebarNav from "./Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { viewMode } = useView();

  if (viewMode === "mobile") {
    return (
      <div className="flex flex-col min-h-screen bg-[#111318] text-brand-silver">
        {/* Mobile Header with Avatar */}
        <div className="p-4 border-b border-brand-silver/20">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex items-center justify-center gap-3">
              <Avatar className="w-10 h-10 border-2 border-brand-accent/50 relative overflow-hidden">
                <AvatarImage 
                  src="/Screen Shot 2025-03-08 at 6.23.26 AM.png" 
                  alt="ALI AI" 
                  className="object-cover scale-[1.8] origin-[center_25%]"
                />
              </Avatar>
              <div className="text-center">
                <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-accent to-brand-purple">
                  ALI AI
                </h2>
                <p className="text-xs text-brand-silver/70">Messaging Agent</p>
              </div>
            </div>
            <div className="flex-shrink-0">
              <ViewToggle />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="min-h-screen pb-16">
            {children}
          </div>
        </main>

        {/* Mobile Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-[#111318] border-t border-brand-silver/20 p-2">
          <SidebarNav isMobile />
        </nav>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen bg-[#111318] text-brand-silver">
        {/* Sidebar - Fixed width */}
        <aside className="w-64 fixed inset-y-0 z-30 bg-brand-backgroundDark border-r border-brand-silver/20">
          {/* Logo Section */}
          <div className="h-32 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-accent/20 via-brand-purple/20 to-transparent blur-xl" />
            <div className="relative">
              <img 
                src="/F3AF1DDE-907C-4D7A-8C8F-3F90B2F2CA87-removebg-preview (1).png" 
                alt="DOMU AI" 
                className="h-32 w-auto object-contain relative z-10 drop-shadow-[0_0_10px_rgba(56,182,255,0.3)]"
              />
            </div>
          </div>

          {/* AI Avatar Section */}
          <div className="py-3 px-4">
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-brand-accent to-brand-purple opacity-75 rounded-full blur"></div>
                <Avatar className="w-20 h-20 border-2 border-brand-accent/50 relative overflow-hidden">
                  <AvatarImage 
                    src="/Screen Shot 2025-03-08 at 6.23.26 AM.png" 
                    alt="ALI AI" 
                    className="object-cover scale-[1.8] origin-[center_25%]"
                  />
                </Avatar>
              </div>
              <div className="flex flex-col items-center justify-center">
                <h2 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-brand-accent to-brand-purple">
                  ALI AI
                </h2>
                <p className="text-sm text-brand-silver/70">Messaging Agent</p>
              </div>
              <ViewToggle />
            </div>
          </div>

          {/* Navigation Menu */}
          <SidebarNav />
        </aside>

        {/* Main Content Area - Offset by sidebar width */}
        <main className="flex-1 ml-64">
          <div className="min-h-screen">
            <div className="max-w-7xl mx-auto p-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}