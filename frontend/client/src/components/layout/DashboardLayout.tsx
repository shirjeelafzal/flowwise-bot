import { type ReactNode } from "react";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import SidebarNav from "./Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
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
            <div className="flex flex-col items-center space-y-3">
              <div className="relative group">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-brand-accent to-brand-purple opacity-75 rounded-full blur"></div>
                <Avatar className="w-20 h-20 border-2 border-brand-accent/50 relative overflow-hidden">
                  <AvatarImage 
                    src="/Screen Shot 2025-03-08 at 6.23.26 AM.png" 
                    alt="Ali" 
                    className="object-cover scale-[1.8] origin-[center_25%]"
                  />
                </Avatar>
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-brand-accent to-brand-purple">
                  Ali
                </h2>
                <p className="text-sm text-brand-silver/70">Messaging Agent</p>
              </div>
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