import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
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
  Rocket
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

const SidebarItem = ({ to, icon: Icon, label, badge }: { to: string, icon: any, label: string, badge?: number }) => (
  <NavLink
    to={to}
    className={({ isActive }) => cn(
      "flex items-center gap-4 px-3 py-3 rounded-xl transition-all group",
      isActive 
        ? "bg-primary/10 text-primary font-bold" 
        : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
    )}
  >
    {({ isActive }) => (
      <>
        <div className="relative">
          <Icon className={cn("w-6 h-6", isActive && "fill-current")} />
          {badge && (
            <span className="absolute -top-1 -right-1 bg-primary text-[10px] text-background-dark font-bold px-1 rounded-full ring-2 ring-background-dark">
              {badge}
            </span>
          )}
        </div>
        <span className="font-medium hidden xl:block">{label}</span>
      </>
    )}
  </NavLink>
);

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      {/* Left Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-20 xl:w-64 border-r border-slate-200 dark:border-slate-800 bg-background-light dark:bg-background-dark flex flex-col py-6 px-4 z-50 transition-all duration-300">
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="bg-primary rounded-lg p-2 text-white">
            <Rocket className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight hidden xl:block text-slate-900 dark:text-white">SocialHub</h1>
        </div>

        <nav className="flex flex-col gap-2 flex-grow">
          <SidebarItem to="/" icon={Home} label="Home" />
          <SidebarItem to="/search" icon={Search} label="Search" />
          <SidebarItem to="/explore" icon={Compass} label="Explore" />
          <SidebarItem to="/reels" icon={Film} label="Reels" />
          <SidebarItem to="/messages" icon={MessageSquare} label="Messages" badge={3} />
          <SidebarItem to="/activity" icon={Bell} label="Activity" />
          <SidebarItem to="/create" icon={PlusSquare} label="Create" />
        </nav>

        <div className="mt-auto flex flex-col gap-4">
          <SidebarItem to="/profile" icon={User} label="Profile" />
          <div className="h-px bg-slate-200 dark:bg-slate-800 mx-2" />
          <div className="flex items-center gap-3 px-2 py-2">
            <img 
              src="https://picsum.photos/seed/user/100/100" 
              alt="User" 
              className="w-10 h-10 rounded-full border border-slate-300 dark:border-slate-700"
              referrerPolicy="no-referrer"
            />
            <div className="hidden xl:block">
              <p className="text-sm font-bold truncate max-w-[120px]">Alex Rivers</p>
              <p className="text-xs text-slate-500">@arivers_99</p>
            </div>
          </div>
          <button className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
            <Menu className="w-6 h-6 text-slate-500 group-hover:text-primary" />
            <span className="font-medium hidden xl:block">More</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-20 xl:ml-64 min-h-screen overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
