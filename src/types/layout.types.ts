// types/layout.types.ts
import { LucideIcon } from "lucide-react";

export interface User {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  isAuthenticated: boolean;
}

export interface NavItem {
  href: string;
  icon: LucideIcon;
  label: string;
  badge?: number;
  active?: boolean;
  requiresAuth?: boolean;
  onClick?: () => void;
}

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'login' | 'signup';
}

export interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  user: User | null;
  navItems: NavItem[];
  onLogin: () => void;
  onSignup: () => void;
  onLogout: () => void;
  variant: 'desktop' | 'mobile';
}