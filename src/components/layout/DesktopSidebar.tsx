// components/layout/DesktopSidebar.tsx
import { LogOut } from "lucide-react";
import { Logo } from "./Logo";
import { SidebarItem } from "./SidebarItem";
import { NavItem, User } from "@/types/layout.types";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
  const isAuthenticated = true;

  // Split nav items into main and profile sections
  const mainNavItems = navItems.filter(item => 
    !['Profile', 'Settings'].includes(item.label)
  );
  
  const profileNavItems = navItems.filter(item => 
    ['Profile', 'Settings'].includes(item.label)
  );

  // Non-authenticated view
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
          <div className="text-center space-y-4 w-full">
            <p className="text-sm text-gray-500 dark:text-gray-400 px-4">
              Sign in to access your dashboard
            </p>
            <div className="space-y-2 px-4">
              <Link
                href="/login"
                className="block w-full bg-primary text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors text-center"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="block w-full border border-gray-300 dark:border-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>

        {/* Version Info */}
        <div className="hidden lg:block px-3 mt-4">
          <p className="text-[10px] text-gray-400 text-center">Version 1.0.0</p>
        </div>
      </aside>
    );
  }

  // Authenticated view
  return (
    <aside className={cn(
      "fixed left-0 top-0 h-screen w-20 lg:w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col py-6 px-3 z-30 hidden lg:flex",
      className
    )}>
      {/* Logo Section */}
      <div className="mb-8 px-2">
        <Logo showText={true} size="md" />
      </div>

      {/* User Info */}
      <div className="px-2 mb-6">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-gray-50 dark:bg-gray-800/50">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="hidden lg:block flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              @{user?.username || 'username'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
        {mainNavItems.map((item) => (
          <SidebarItem key={item.href} {...item} />
        ))}
      </nav>

      {/* Profile Section & Logout */}
      <div className="mt-auto flex flex-col gap-1 pt-4 border-t border-gray-200 dark:border-gray-800">
        {profileNavItems.map((item) => (
          <SidebarItem key={item.href} {...item} />
        ))}

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-gray-600 dark:text-gray-400 transition-colors group mt-1"
          aria-label="Logout"
        >
          <LogOut className="w-5 h-5 lg:w-6 lg:h-6 group-hover:text-red-500 transition-colors" />
          <span className="hidden lg:block font-medium group-hover:text-red-500 transition-colors">
            Logout
          </span>
        </button>
      </div>

      {/* Version Info */}
      <div className="hidden lg:block px-3 mt-4">
        <p className="text-[10px] text-gray-400 text-center">Version 1.0.0</p>
      </div>
    </aside>
  );
}