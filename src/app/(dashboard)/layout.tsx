// app/layout.tsx
"use client";

import React, { useState } from "react";
import {
  Home,
  Search,
  Compass,
  Film,
  MessageSquare,
  Bell,
  PlusSquare,
  Bookmark,
  User,
  Settings,
} from "lucide-react";

import { DesktopSidebar } from "@/components/layout/DesktopSidebar";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { useAuth } from "@/hooks/useAuth";
import { useScroll } from "@/hooks/useScroll";
import { NavItem } from "@/types/layout.types";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { user, isAuthenticated, logout } = useAuth();
  const isScrolled = useScroll(10);

  // Complete navigation items
  const navItems: NavItem[] = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/search", icon: Search, label: "Search" },
    { href: "/explore", icon: Compass, label: "Explore" },
    { href: "/reels", icon: Film, label: "Reels" },
    { 
      href: "/messages", 
      icon: MessageSquare, 
      label: "Messages", 
      badge: 3 
    },
    { 
      href: "/notifications", 
      icon: Bell, 
      label: "Notifications" 
    },
    { 
      href: "/create", 
      icon: PlusSquare, 
      label: "Create" 
    },
    { 
      href: "/saved", 
      icon: Bookmark, 
      label: "Saved" 
    },
    { 
      href: "/profile", 
      icon: User, 
      label: "Profile" 
    },
    { 
      href: "/settings", 
      icon: Settings, 
      label: "Settings" 
    },
  ];

  // For authenticated users, show all items
  // For non-authenticated, filter out items that require auth
  const filteredNavItems = isAuthenticated 
    ? navItems 
    : navItems.filter(item => 
        ['Home', 'Search', 'Explore'].includes(item.label)
      );

  const handleMenuToggle = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const handleMenuClose = () => setIsMobileMenuOpen(false);

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900">
      <MobileHeader
        isAuthenticated={isAuthenticated}
        isMenuOpen={isMobileMenuOpen}
        onMenuToggle={handleMenuToggle}
        isScrolled={isScrolled}
      />

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={handleMenuClose}
        user={user}
        navItems={filteredNavItems}
        onLogout={handleLogout}
      />

      <DesktopSidebar
        user={user}
        navItems={filteredNavItems}
        onLogout={handleLogout}
      />

      {isAuthenticated && <MobileBottomNav />}

      <main className="flex-1 lg:ml-20 xl:ml-64 min-h-screen pb-16 lg:pb-0 pt-14 lg:pt-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          {children}
        </div>
      </main>
    </div>
  );
}