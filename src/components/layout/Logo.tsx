// components/layout/Logo.tsx
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Logo({ showText = true, size = 'md', className }: LogoProps) {
  const sizeClasses = {
    sm: {
      container: "w-8 h-8 rounded-lg",
      icon: "w-4 h-4",
      text: "text-lg"
    },
    md: {
      container: "w-10 h-10 rounded-xl",
      icon: "w-5 h-5",
      text: "text-xl"
    },
    lg: {
      container: "w-12 h-12 rounded-xl",
      icon: "w-6 h-6",
      text: "text-2xl"
    }
  };

  return (
    <Link href="/" className={cn("flex items-center gap-3", className)}>
      <div className={cn(
        "bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white",
        sizeClasses[size].container
      )}>
        <span className={sizeClasses[size].icon}>S</span>
      </div>
      {showText && (
        <span className={cn("font-bold", sizeClasses[size].text)}>Socioo</span>
      )}
    </Link>
  );
}