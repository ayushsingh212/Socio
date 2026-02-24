// components/layout/DesktopSidebar.tsx
import { LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";
import { SidebarItem } from "./SidebarItem";
import { NavItem, User } from "@/types/layout.types";
import { cn } from "@/lib/utils";

interface DesktopSidebarProps {
  user: User | null;
  navItems: NavItem[];
  onLogout: () => void;
  className?: string;
}

export function DesktopSidebar({
  user,
  navItems,
  onLogout,
  className
}: DesktopSidebarProps) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const isAuthenticated = true;

  // Split nav items into main and secondary if needed
  const mainNavItems = navItems.filter(item => 
    !['Settings', 'Profile'].includes(item.label)
  );
  
  const secondaryNavItems = navItems.filter(item => 
    ['Profile', 'Settings'].includes(item.label)
  );

  if (!isAuthenticated) {
    return (
      <aside className={cn(
        "fixed left-0 top-0 h-screen w-20 lg:w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col py-6 px-3 z-30 hidden lg:flex",
        className
      )}>
        <div className="mb-8 px-2">
          <Logo showText={true} size="md" />
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 px-4">
              Sign in to access your dashboard
            </p>
            <div className="space-y-2 px-4">
              <a
                href="/login"
                className="block w-full bg-primary text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Log In
              </a>
              <a
                href="/register"
                className="block w-full border border-gray-300 dark:border-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-screen w-20 lg:w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col py-6 px-3 z-30 hidden lg:flex",
      className
    )}>
      {/* Logo Section */}
      <div className="mb-8 px-2">
        <Logo showText={true} size="md" />
      </div>

      {/* User Info - Collapsed/Expanded view */}
      <div className="px-2 mb-6">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-gray-50 dark:bg-gray-800/50">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-semibold text-sm">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="hidden lg:block flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">@{user?.username}</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
        {mainNavItems.map((item) => (
          <SidebarItem key={item.href} {...item} />
        ))}
      </nav>

      {/* Secondary Navigation & Logout */}
      <div className="mt-auto flex flex-col gap-1 pt-4 border-t border-gray-200 dark:border-gray-800">
        {secondaryNavItems.map((item) => (
          <SidebarItem key={item.href} {...item} />
        ))}

        {/* Profile Menu Dropdown (Alternative to separate profile item) */}
        <div className="relative lg:hidden">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center justify-between w-full px-3 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
          >
            <div className="flex items-center gap-4">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white text-[10px] font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <span className="font-medium hidden lg:block">Profile</span>
            </div>
            <ChevronDown className={cn(
              "w-4 h-4 transition-transform hidden lg:block",
              isProfileMenuOpen && "rotate-180"
            )} />
          </button>
          
          {isProfileMenuOpen && (
            <div className="absolute bottom-full left-0 w-full mb-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg overflow-hidden">
              <a
                href="/profile"
                className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                View Profile
              </a>
              <a
                href="/settings"
                className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Settings
              </a>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-gray-600 dark:text-gray-400 transition-colors group"
          aria-label="Logout"
        >
          <LogOut className="w-5 h-5 lg:w-6 lg:h-6 group-hover:text-red-500 transition-colors" />
          <span className="hidden lg:block font-medium group-hover:text-red-500 transition-colors">Logout</span>
        </button>
      </div>

      {/* Version Info - Optional */}
      <div className="hidden lg:block px-3 mt-4">
        <p className="text-[10px] text-gray-400">Version 1.0.0</p>
      </div>
    </aside>
  );
}