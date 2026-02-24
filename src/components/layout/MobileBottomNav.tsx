// components/layout/MobileBottomNav.tsx
import Link from "next/link";
import { Home, Compass, PlusSquare, Bell, User } from "lucide-react";

export function MobileBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-30 lg:hidden">
      <div className="flex items-center justify-around px-2 py-1">
        <Link 
          href="/" 
          className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <Home className="w-5 h-5 lg:w-6 lg:h-6" />
        </Link>
        
        <Link 
          href="/explore" 
          className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <Compass className="w-5 h-5 lg:w-6 lg:h-6" />
        </Link>
        
        <Link href="/create" className="p-3">
          <div className="bg-primary text-white p-2 rounded-full hover:bg-primary/90 transition-colors">
            <PlusSquare className="w-5 h-5" />
          </div>
        </Link>
        
        <Link 
          href="/activity" 
          className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full relative transition-colors"
        >
          <Bell className="w-5 h-5 lg:w-6 lg:h-6" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
        </Link>
        
        <Link 
          href="/profile" 
          className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <User className="w-5 h-5 lg:w-6 lg:h-6" />
        </Link>
      </div>
    </nav>
  );
}