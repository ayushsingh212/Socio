"use client";

import React from "react";
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
} from "lucide-react";

import { cn } from "@/lib/utils";

type SidebarItemProps = {
  href: string;
  icon: any;
  label: string;
  badge?: number;
};

function SidebarItem({ href, icon: Icon, label, badge }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-4 px-3 py-3 rounded-xl transition-all group",
        isActive
          ? "bg-primary/10 text-primary font-bold"
          : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
      )}
    >
      <div className="relative">
        <Icon className="w-6 h-6" />

        {badge && (
          <span className="absolute -top-1 -right-1 bg-primary text-[10px] text-white font-bold px-1 rounded-full">
            {badge}
          </span>
        )}
      </div>

      <span className="font-medium hidden xl:block">{label}</span>
    </Link>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-20 xl:w-64 border-r bg-background-light flex flex-col py-6 px-4 z-50">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="bg-primary rounded-lg p-2 text-white">
            <img src="/logo.png" className="w-6 h-6" />
          </div>

          <h1 className="hidden xl:block text-xl font-bold">
            SocialHub
          </h1>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-2 grow">
          <SidebarItem href="/" icon={Home} label="Home" />
          <SidebarItem href="/search" icon={Search} label="Search" />
          <SidebarItem href="/explore" icon={Compass} label="Explore" />
          <SidebarItem href="/reels" icon={Film} label="Reels" />
          <SidebarItem
            href="/messages"
            icon={MessageSquare}
            label="Messages"
            badge={3}
          />
          <SidebarItem href="/activity" icon={Bell} label="Activity" />
          <SidebarItem href="/create" icon={PlusSquare} label="Create" />
        </nav>

        {/* Footer */}
        <div className="mt-auto flex flex-col gap-4">
          <SidebarItem href="/profile" icon={User} label="Profile" />

          <div className="h-px bg-slate-200 mx-2" />

          <button className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-slate-100">
            <Menu className="w-6 h-6" />
            <span className="hidden xl:block">More</span>
          </button>
        </div>
      </aside>

      {/* Main Content = Outlet */}
      <main className="flex-1 ml-20 xl:ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}