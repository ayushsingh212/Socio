// components/layout/SidebarItem.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types/layout.types";

interface SidebarItemProps extends NavItem {
  collapsed?: boolean;
  onClick?: () => void;
}

export function SidebarItem({ 
  href, 
  icon: Icon, 
  label, 
  badge, 
  collapsed = false,
  onClick 
}: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 px-3 py-3 rounded-xl transition-all group relative",
        isActive
          ? "bg-primary/10 text-primary font-semibold"
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
      )}
    >
      <div className="relative">
        <Icon className="w-5 h-5 lg:w-6 lg:h-6" />
        {badge && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-[10px] text-white font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
            {badge}
          </span>
        )}
      </div>
      {!collapsed && (
        <>
          <span className="font-medium hidden lg:block">{label}</span>
          {isActive && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full hidden lg:block" />
          )}
        </>
      )}
    </Link>
  );
}