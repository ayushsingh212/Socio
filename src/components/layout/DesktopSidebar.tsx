// components/layout/DesktopSidebar.tsx
import { LogOut, Sparkles, ChevronRight } from "lucide-react";
import { Logo } from "./Logo";
import { SidebarItem } from "./SidebarItem";
import { NavItem, User } from "@/types/layout.types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { useAuthStore } from "@/store/auth.store";

interface DesktopSidebarProps {
  user: User | null;
  navItems: NavItem[];
  onLogout: () => void;
  className?: string;
}

export function DesktopSidebar({
  
  navItems,
  onLogout,
  className
}: DesktopSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isAuthenticated = true;

   const {user} = useAuthStore();


  
   const [currentUser, setCurrentUser] = useState(()=>user.user.data || null)



   console.log("Here is the coming user",user)

   

  const mainNavItems = navItems.filter(item => 
    !['Profile', 'Settings'].includes(item.label)
  );
  
  const profileNavItems = navItems.filter(item => 
    ['Profile', 'Settings'].includes(item.label)
  );

  if (!isAuthenticated) {
    return (
      <aside className={cn(
        "fixed left-0 top-0 h-screen bg-gradient-to-b from-gray-900 to-black border-r border-gray-800 flex flex-col py-6 px-3 z-30 hidden lg:flex overflow-hidden transition-all duration-300",
        isCollapsed ? "w-20" : "w-64",
        className
      )}>
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center hover:bg-gray-700 transition z-50"
        >
          <ChevronRight className={cn(
            "w-4 h-4 text-white transition-transform",
            isCollapsed ? "rotate-0" : "rotate-180"
          )} />
        </button>

        <div className={cn("mb-8", isCollapsed ? "px-0" : "px-2")}>
          <Logo showText={!isCollapsed} size="md" />
        </div>
        
        <div className="flex-1 flex items-center justify-center overflow-y-auto">
          <div className="text-center space-y-4 w-full">
            <p className={cn(
              "text-sm text-gray-400",
              isCollapsed ? "hidden" : "block"
            )}>
              Sign in to access
            </p>
            <div className={cn("space-y-2", isCollapsed ? "px-1" : "px-4")}>
              <Link
                href="/login"
                className="block w-full bg-gradient-to-r from-yellow-400 to-pink-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-yellow-300 hover:to-pink-500 transition-all text-center"
              >
                {isCollapsed ? "→" : "Log In"}
              </Link>
              {!isCollapsed && (
                <Link
                  href="/register"
                  className="block w-full border border-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors text-center text-gray-300"
                >
                  Sign Up
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Version Info */}
        {!isCollapsed && (
          <div className="px-3 mt-4">
            <p className="text-[10px] text-gray-600 text-center">Version 1.0.0</p>
          </div>
        )}
      </aside>
    );
  }

  // Authenticated view
  return (
    <aside className={cn(
      "fixed left-0 top-0 h-screen bg-gradient-to-b from-gray-900 to-black border-r border-gray-800 flex flex-col py-6 px-3 z-30 hidden lg:flex transition-all duration-300",
      isCollapsed ? "w-20" : "w-64",
      className
    )}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center hover:bg-gray-700 transition z-50"
      >
        <ChevronRight className={cn(
          "w-4 h-4 text-white transition-transform",
          isCollapsed ? "rotate-0" : "rotate-180"
        )} />
      </button>

      {/* Logo Section */}
      <div className={cn("flex-shrink-0", isCollapsed ? "px-0" : "px-2")}>
        <Logo showText={!isCollapsed} size="md" />
      </div>

      {/* Premium Badge */}
      <div className={cn(
        "flex-shrink-0 mt-4 mb-2",
        isCollapsed ? "px-1" : "px-2"
      )}>
        <div className={cn(
          "bg-gradient-to-r from-yellow-400/10 to-pink-600/10 rounded-xl border border-yellow-400/20",
          isCollapsed ? "p-2" : "p-3"
        )}>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            {!isCollapsed && (
              <>
                <span className="text-xs text-gray-300 flex-1">Premium</span>
                <span className="text-[10px] bg-yellow-400/20 text-yellow-400 px-1.5 py-0.5 rounded">
                  PRO
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className={cn(
        "flex-shrink-0",
        isCollapsed ? "px-1 mt-2" : "px-2 mt-4"
      )}>
        <div className={cn(
          "flex items-center gap-3 p-2 rounded-xl bg-gray-800/50 border border-gray-700",
          isCollapsed ? "justify-center" : ""
        )}>
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-pink-600 p-[2px]">
              <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-white font-semibold text-sm">
                {currentUser.fullName?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"></div>
          </div>
          
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{currentUser?.fullName || 'User'}</p>
              <p className="text-xs text-gray-400 truncate">
                @{currentUser.username || 'username'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto min-h-0 mt-6 px-1 custom-scrollbar">
        <div className="flex flex-col gap-1">
          {mainNavItems.map((item) => (
            <SidebarItem 
              key={item.href} 
              {...item} 
              collapsed={isCollapsed}
            />
          ))}
        </div>
      </nav>

      {/* Profile Section & Logout */}
      <div className="flex-shrink-0 mt-auto pt-4 border-t border-gray-800">
        <div className="flex flex-col gap-1 px-1">
          {profileNavItems.map((item) => (
            <SidebarItem 
              key={item.href} 
              {...item} 
              collapsed={isCollapsed}
            />
          ))}

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className={cn(
              "flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-gray-800 w-full text-gray-400 transition-colors group mt-1",
              isCollapsed ? "justify-center" : ""
            )}
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5 lg:w-6 lg:h-6 group-hover:text-red-500 transition-colors" />
            {!isCollapsed && (
              <span className="font-medium group-hover:text-red-500 transition-colors">
                Logout
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Version Info */}
      {!isCollapsed && (
        <div className="flex-shrink-0 px-3 mt-4">
          <p className="text-[10px] text-gray-600 text-center">Version 1.0.0</p>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 20px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4B5563;
        }
      `}</style>
    </aside>
  );
}