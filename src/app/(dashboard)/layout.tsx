"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Home,
  Search,
  Compass,
  Film,
  MessageSquare,
  Bell,
  PlusSquare,
  User,
  Menu,
  X,
  LogOut,
  Settings,
  Bookmark,
} from "lucide-react";

import { cn } from "@/lib/utils";

type SidebarItemProps = {
  href: string;
  icon: any;
  label: string;
  badge?: number;
  onClick?: () => void;
};

function SidebarItem({ href, icon: Icon, label, badge, onClick }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 px-3 py-3 rounded-xl transition-all group relative",
        isActive
          ? "bg-primary/10 text-primary font-bold"
          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
      )}
    >
      <div className="relative">
        <Icon className="w-6 h-6" />
        {badge && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-[10px] text-white font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
            {badge}
          </span>
        )}
      </div>
      <span className="font-medium hidden lg:block">{label}</span>
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full hidden lg:block" />
      )}
    </Link>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900">
    
      <header className={cn(
        "fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 z-40 lg:hidden transition-all",
        isScrolled ? "border-b border-gray-200 dark:border-gray-800 shadow-sm" : ""
      )}>
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <div className="bg-primary rounded-lg p-1.5">
              <img src="/logo.png" alt="Logo" className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold">SocialHub</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
              <Bell className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className={cn(
        "fixed top-0 right-0 h-full w-72 bg-white dark:bg-gray-900 z-50 transform transition-transform duration-300 ease-in-out lg:hidden",
        isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="bg-primary rounded-lg p-2">
                <img src="/logo.png" alt="Logo" className="w-6 h-6" />
              </div>
              <span className="font-bold text-lg">Menu</span>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-1 flex-1">
            <SidebarItem href="/" icon={Home} label="Home" onClick={() => setIsMobileMenuOpen(false)} />
            <SidebarItem href="/search" icon={Search} label="Search" onClick={() => setIsMobileMenuOpen(false)} />
            <SidebarItem href="/explore" icon={Compass} label="Explore" onClick={() => setIsMobileMenuOpen(false)} />
            <SidebarItem href="/reels" icon={Film} label="Reels" onClick={() => setIsMobileMenuOpen(false)} />
            <SidebarItem href="/messages" icon={MessageSquare} label="Messages" badge={3} onClick={() => setIsMobileMenuOpen(false)} />
            <SidebarItem href="/activity" icon={Bell} label="Activity" onClick={() => setIsMobileMenuOpen(false)} />
            <SidebarItem href="/create" icon={PlusSquare} label="Create" onClick={() => setIsMobileMenuOpen(false)} />
            <SidebarItem href="/saved" icon={Bookmark} label="Saved" onClick={() => setIsMobileMenuOpen(false)} />
            
            <div className="h-px bg-gray-200 dark:bg-gray-800 my-4" />
            
            <SidebarItem href="/profile" icon={User} label="Profile" onClick={() => setIsMobileMenuOpen(false)} />
            <SidebarItem href="/settings" icon={Settings} label="Settings" onClick={() => setIsMobileMenuOpen(false)} />
            
            <button className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-red-500 mt-auto">
              <LogOut className="w-6 h-6" />
              <span className="font-medium">Logout</span>
            </button>
          </nav>
        </div>
      </div>


      <aside className="fixed left-0 top-0 h-screen w-20 lg:w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col py-6 px-4 z-30 hidden lg:flex">
 
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="bg-primary rounded-lg p-2 text-white">
            <img src="/logo.png" alt="Logo" className="w-6 h-6" />
          </div>
          <h1 className="hidden lg:block text-xl font-bold">
            SocialHub
          </h1>
        </div>


        <nav className="flex flex-col gap-1 flex-1">
          <SidebarItem href="/" icon={Home} label="Home" />
          <SidebarItem href="/search" icon={Search} label="Search" />
          <SidebarItem href="/explore" icon={Compass} label="Explore" />
          <SidebarItem href="/reels" icon={Film} label="Reels" />
          <SidebarItem href="/messages" icon={MessageSquare} label="Messages" badge={3} />
          <SidebarItem href="/activity" icon={Bell} label="Activity" />
          <SidebarItem href="/create" icon={PlusSquare} label="Create" />
          <SidebarItem href="/saved" icon={Bookmark} label="Saved" />
        </nav>


        <div className="mt-auto flex flex-col gap-1">
          <SidebarItem href="/profile" icon={User} label="Profile" />
          <div className="h-px bg-gray-200 dark:bg-gray-800 my-2" />
          <button className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-slate-600 dark:text-slate-400">
            <Menu className="w-6 h-6" />
            <span className="hidden lg:block">More</span>
          </button>
        </div>
      </aside>


      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-30 lg:hidden">
        <div className="flex items-center justify-around px-2 py-1">
          <Link href="/" className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <Home className="w-6 h-6" />
          </Link>
          <Link href="/explore" className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <Compass className="w-6 h-6" />
          </Link>
          <Link href="/create" className="p-3">
            <div className="bg-primary text-white p-2 rounded-full">
              <PlusSquare className="w-5 h-5" />
            </div>
          </Link>
          <Link href="/activity" className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full relative">
            <Bell className="w-6 h-6" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
          </Link>
          <Link href="/profile" className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <User className="w-6 h-6" />
          </Link>
        </div>
      </nav>


      <main className="flex-1 lg:ml-20 xl:ml-64 min-h-screen pb-16 lg:pb-0 pt-14 lg:pt-0">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}