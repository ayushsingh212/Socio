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
  Sparkles,
  Flame,
  Music,
  Camera,
  Globe2,
  Palette,
  LogOut,
  ChevronLeft,
  Menu,
  X,
  Heart,
  Star
} from "lucide-react";

import { DesktopSidebar } from "@/components/layout/DesktopSidebar";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { MobileHeader } from "@/components/layout/MobileHeader";
import {  useAuthBootstrap } from "@/hooks/useAuth";
import { useScroll } from "@/hooks/useScroll";
import { NavItem } from "@/types/layout.types";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState("For You");
  
  // const { user, isAuthenticated, logout } = useAuth();
  const isScrolled = useScroll(10);
    useAuthBootstrap()

  const { user, isLoading,logout} = useAuthStore()
  const router = useRouter()

  const isAuthenticated = !!user
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login")
    }
  }, [user, isLoading,router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    )
  }

  console.log("Here is the main user in the layout",user)
  if(!user) return null;


  const navItems: NavItem[] = [
    { href: "/", icon: Home, label: "Home", active: true },
    { href: "/search", icon: Search, label: "Search" },
    { href: "/explore", icon: Compass, label: "Explore" },
    { href: "/reels", icon: Film, label: "Reels", badge: 3 },
    { 
      href: "/messages", 
      icon: MessageSquare, 
      label: "Messages", 
      badge: 3 
    },
    { 
      href: "/notifications", 
      icon: Bell, 
      label: "Notifications",
      badge: 5 
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
      href: `/profile/${user.user.data.username}`, 
      icon: User, 
      label: "Profile" 
    },
    { 
      href: "/settings", 
      icon: Settings, 
      label: "Settings" 
    },
  ];

  const categories = [
    { icon: Sparkles, name: "For You", color: "from-yellow-400 to-pink-500" },
    { icon: Flame, name: "Trending", color: "from-orange-500 to-red-500" },
    { icon: Music, name: "Music", color: "from-purple-500 to-pink-500" },
    { icon: Camera, name: "Photography", color: "from-blue-500 to-cyan-500" },
    { icon: Globe2, name: "Travel", color: "from-green-500 to-emerald-500" },
    { icon: Palette, name: "Art", color: "from-pink-500 to-rose-500" },
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

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 w-full overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-yellow-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden w-full relative z-50">
        <div className={cn(
          "fixed top-0 left-0 right-0 transition-all duration-300",
          isScrolled ? "bg-gray-900/95 backdrop-blur-lg border-b border-gray-800" : "bg-transparent"
        )}>
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={handleMenuToggle}
                className="p-2 hover:bg-gray-800 rounded-lg transition"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-white" />
                ) : (
                  <Menu className="w-5 h-5 text-white" />
                )}
              </button>
              <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                Socio
              </h1>
            </div>
            
            {isAuthenticated && (
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-800 rounded-lg transition relative">
                  <Heart className="w-5 h-5 text-gray-400 hover:text-white" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-pink-600 rounded-full"></span>
                </button>
                <button className="p-2 hover:bg-gray-800 rounded-lg transition">
                  <Bell className="w-5 h-5 text-gray-400 hover:text-white" />
                </button>
              </div>
            )}
          </div>

          {/* Categories Scroll - Mobile */}
          <div className="px-4 pb-3 overflow-x-auto hide-scrollbar">
            <div className="flex gap-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCategory(cat.name)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap",
                      activeCategory === cat.name
                        ? `bg-gradient-to-r ${cat.color} text-white`
                        : "bg-gray-800/50 text-gray-400 hover:bg-gray-800"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={handleMenuClose}
        user={user}
        navItems={filteredNavItems}
        onLogout={handleLogout}
      />

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-full z-40">
        <DesktopSidebar
          user={user}
          navItems={filteredNavItems}
          onLogout={handleLogout}
        />
      </div>

      {/* Main Content */}
      <main className={`
        flex-1 min-h-screen w-full transition-all duration-300
        lg:ml-72
        ${isAuthenticated ? 'pb-16 lg:pb-0' : 'pb-0'}
        ${isMobileMenuOpen ? 'overflow-hidden' : ''}
      `}>
        <div className="relative">
          {/* Desktop Categories Bar */}
          <div className="hidden lg:block fixed top-0 right-0 left-72 z-30 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
            <div className="px-8 py-4">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-white">Feed</h2>
                <div className="flex items-center gap-2 flex-1 overflow-x-auto hide-scrollbar">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.name}
                        onClick={() => setActiveCategory(cat.name)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                          activeCategory === cat.name
                            ? `bg-gradient-to-r ${cat.color} text-white`
                            : "text-gray-400 hover:text-white hover:bg-gray-800"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        {cat.name}
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-800 rounded-lg transition relative">
                    <Bell className="w-5 h-5 text-gray-400 hover:text-white" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-pink-600 rounded-full"></span>
                  </button>
                  <button className="p-2 hover:bg-gray-800 rounded-lg transition">
                    <MessageSquare className="w-5 h-5 text-gray-400 hover:text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className={`
            w-full mx-auto
            pt-32 lg:pt-24
            px-4 sm:px-6 lg:px-8
          `}>
            <div className="max-w-4xl mx-auto w-full">
              {children}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      {isAuthenticated && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
          <div className="bg-gray-900/95 backdrop-blur-lg border-t border-gray-800">
            <div className="flex items-center justify-around py-2">
              {navItems.slice(0, 5).map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex flex-col items-center p-2 relative group"
                  >
                    <Icon className="w-5 h-5 text-gray-400 group-hover:text-white transition" />
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-600 rounded-full text-[10px] flex items-center justify-center text-white">
                        {item.badge}
                      </span>
                    )}
                    <span className="text-[10px] text-gray-500 group-hover:text-gray-400 mt-1">
                      {item.label}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 2s ease infinite;
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}