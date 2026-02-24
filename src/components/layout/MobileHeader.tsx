// components/layout/MobileHeader.tsx
import { Bell, Menu, X } from "lucide-react";
import { Logo } from "./Logo";

interface MobileHeaderProps {
  isAuthenticated: boolean;
  isMenuOpen: boolean;
  onMenuToggle: () => void;
  isScrolled: boolean;
}

export function MobileHeader({
  isAuthenticated,
  isMenuOpen,
  onMenuToggle,
  isScrolled
}: MobileHeaderProps) {
  return (
    <header className={`
      fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 z-40 lg:hidden
      transition-all ${isScrolled ? 'border-b border-gray-200 dark:border-gray-800 shadow-sm' : ''}
    `}>
      <div className="flex items-center justify-between px-4 h-14">
        <Logo showText={true} size="sm" />

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button
                onClick={onMenuToggle}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </>
          ) : (
            // Just show menu button when not authenticated
            <button
              onClick={onMenuToggle}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}