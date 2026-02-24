// components/layout/AuthButtons.tsx
import { cn } from "@/lib/utils";

interface AuthButtonsProps {
  variant: 'mobile' | 'desktop';
  onLogin: () => void;
  onSignup: () => void;
  className?: string;
}

export function AuthButtons({ variant, onLogin, onSignup, className }: AuthButtonsProps) {
  const isDesktop = variant === 'desktop';

  return (
    <div className={cn(
      "flex gap-2",
      isDesktop ? 'flex-col' : 'items-center',
      className
    )}>
      <button
        onClick={onLogin}
        className={cn(
          "font-medium transition-colors",
          isDesktop 
            ? "w-full bg-primary text-white py-2 rounded-lg text-sm hover:bg-primary/90" 
            : "px-3 py-1.5 text-sm text-primary border border-primary rounded-lg hover:bg-primary/5"
        )}
      >
        Log In
      </button>
      <button
        onClick={onSignup}
        className={cn(
          "font-medium transition-colors",
          isDesktop
            ? "w-full border border-gray-300 dark:border-gray-700 py-2 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
            : "px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary/90"
        )}
      >
        Sign Up
      </button>
    </div>
  );
}