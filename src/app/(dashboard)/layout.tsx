"use client";

import React, { useState, useEffect } from "react";
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
  const [mounted, setMounted] = useState(false);
  
  const { user, isAuthenticated, logout } = useAuth();
  const isScrolled = useScroll(10);

  // Handle mounting to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Complete navigation items
  const navItems: NavItem[] = [
    { href: "/dashboard", icon: Home, label: "Home" },
    { href: "/dashboard/search", icon: Search, label: "Search" },
    { href: "/dashboard/explore", icon: Compass, label: "Explore" },
    { href: "/dashboard/reels", icon: Film, label: "Reels" },
    { 
      href: "/dashboard/messages", 
      icon: MessageSquare, 
      label: "Messages", 
      badge: 3 
    },
    { 
      href: "/dashboard/notifications", 
      icon: Bell, 
      label: "Notifications" 
    },
    { 
      href: "/dashboard/create", 
      icon: PlusSquare, 
      label: "Create" 
    },
    { 
      href: "/dashboard/saved", 
      icon: Bookmark, 
      label: "Saved" 
    },
    { 
      href: "/dashboard/profile", 
      icon: User, 
      label: "Profile" 
    },
    { 
      href: "/dashboard/settings", 
      icon: Settings, 
      label: "Settings" 
    },
  ];

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

  // Prevent rendering until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900 w-full overflow-x-hidden">
      {/* Mobile Header - Only visible on mobile */}
      <div className="lg:hidden w-full">
        <MobileHeader
          isAuthenticated={isAuthenticated}
          isMenuOpen={isMobileMenuOpen}
          onMenuToggle={handleMenuToggle}
          isScrolled={isScrolled}
        />
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={handleMenuClose}
        user={user}
        navItems={filteredNavItems}
        onLogout={handleLogout}
      />

      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden lg:block">
        <DesktopSidebar
          user={user}
          navItems={filteredNavItems}
          onLogout={handleLogout}
        />
      </div>

      {/* Main Content - Adjusted for mobile */}
      <main className={`
        flex-1 min-h-screen w-full transition-all duration-300
        ${isAuthenticated ? 'pb-16 lg:pb-0' : 'pb-0'}
        ${isMobileMenuOpen ? 'overflow-hidden' : ''}
      `}>
        <div className={`
          w-full mx-auto
          ${isAuthenticated ? 'pt-14 lg:pt-6' : 'pt-14 lg:pt-6'}
          px-4 sm:px-6 lg:px-8
        `}>
          {/* Content container with proper max-width */}
          <div className="max-w-4xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>

      {isAuthenticated && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
          <MobileBottomNav />
        </div>
      )}
    </div>
  );
}