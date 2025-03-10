import { Link, useLocation } from "wouter";
import { Home, MessageCircle, Share2, Calendar, Settings, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const menuItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: Bot, label: "Talk to Ali", href: "/chat" },
  { icon: MessageCircle, label: "Conversations", href: "/conversations" },
  { icon: Share2, label: "My Socials", href: "/my-socials" },
  { icon: Calendar, label: "Connection Settings", href: "/settings" },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 h-screen">
      <nav className="space-y-1 px-2">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start font-normal h-11",
                "group flex items-center px-3 py-2.5 rounded-lg relative overflow-hidden",
                "hover:bg-brand-accent/10 transition-all duration-300",
                "before:absolute before:inset-0 before:bg-gradient-to-r before:from-brand-accent/20 before:to-brand-purple/20 before:opacity-0 before:transition-opacity",
                "hover:before:opacity-100",
                location === item.href && [
                  "bg-brand-accent/10",
                  "before:opacity-100",
                  "after:absolute after:inset-y-0 after:left-0 after:w-0.5",
                  "after:bg-gradient-to-b after:from-brand-accent after:to-brand-purple"
                ]
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 mr-3 transition-colors",
                location === item.href
                  ? "text-brand-accent"
                  : "text-brand-silver group-hover:text-brand-accent"
              )} />
              <span className={cn(
                "text-sm transition-colors",
                location === item.href
                  ? "text-brand-accent"
                  : "text-brand-silver group-hover:text-brand-accent"
              )}>
                {item.label}
              </span>
            </Button>
          </Link>
        ))}
      </nav>
    </div>
  );
}