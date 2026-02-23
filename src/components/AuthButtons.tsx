"use client";

interface AuthButtonsProps {
  onLogin: () => void;
  onSignup: () => void;
}

export default function AuthButtons({ onLogin, onSignup }: AuthButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onLogin}
        className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors"
      >
        Log In
      </button>
      <button
        onClick={onSignup}
        className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
      >
        Sign Up
      </button>
    </div>
  );
}