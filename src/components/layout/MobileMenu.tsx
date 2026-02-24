// components/layout/MobileMenu.tsx
import { X, LogOut } from "lucide-react";
import { SidebarItem } from "./SidebarItem";
import { NavItem } from "@/types/layout.types";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: any | null;
  navItems: NavItem[];
  onLogout: () => void;
}

export function MobileMenu({
  isOpen,
  onClose,
  user,
  navItems,
  onLogout
}: MobileMenuProps) {
  const isAuthenticated = true;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Menu panel */}
      <div className={cn(
        "fixed top-0 right-0 h-full w-72 bg-white dark:bg-gray-900 z-50 transform transition-transform duration-300 ease-in-out lg:hidden",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col h-full p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="bg-primary rounded-lg p-2">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="font-bold text-lg">Menu</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {isAuthenticated ? (
            // Authenticated menu
            <nav className="flex flex-col gap-1 flex-1">
              {navItems.map((item) => (
                <SidebarItem 
                  key={item.href} 
                  {...item} 
                  onClick={onClose}
                />
              ))}

              <div className="h-px bg-gray-200 dark:bg-gray-800 my-4" />

              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-red-500 mt-auto transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </nav>
          ) : (
            // Non-authenticated menu - just show message
            <nav className="flex flex-col gap-4 flex-1">
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  Please log in to access the dashboard
                </p>
                <p className="text-xs text-gray-600">
                  Visit the login page to continue
                </p>
              </div>
            </nav>
          )}
        </div>
      </div>
    </>
  );
}