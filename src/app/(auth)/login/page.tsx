"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!identifier.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      router.push("/");
      
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
        
        {/* Left side - Phone mockup with image */}
        <div className="hidden lg:block relative w-[380px] h-[580px]">
          <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-[3rem] rotate-2 opacity-75 blur"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-[3rem] rotate-3 opacity-75 blur"></div>
          <div className="relative z-10 bg-black rounded-[3rem] p-3 h-full border-4 border-gray-800">
            <div className="w-full h-full rounded-[2.5rem] overflow-hidden bg-black">
              <img 
                src="./logo.png" 
                alt="Social media feed preview"
                className="w-full h-full object-cover m-20"
              />
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              Socio
            </h1>
          </div>

          {/* Login card */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
            {/* Error message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {/* Login form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Phone number, username or email"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-gray-600 text-sm"
                disabled={loading}
                autoComplete="username"
              />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-gray-600 text-sm"
                disabled={loading}
                autoComplete="current-password"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-gray-900 px-4 text-gray-500">OR</span>
              </div>
            </div>

            {/* Google login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Sign up link */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mt-4 text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-blue-500 font-semibold hover:text-blue-400"
              >
                Sign up
              </Link>
            </p>
          </div>

          {/* Get the app links */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500 mb-4">Get the app.</p>
            <div className="flex items-center justify-center gap-2">
              <button className="bg-black border border-gray-800 rounded-lg px-3 py-2 hover:border-gray-700 transition-colors">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.6 9.6c-.1.1-1.9 1.1-1.9 3.4 0 2.6 2.3 3.5 2.4 3.5 0 .1-.4 1.3-1.2 2.6-.8 1.2-1.5 2.4-2.8 2.4-1.3 0-1.7-.8-3.2-.8-1.5 0-2 .8-3.2.8-1.3 0-2.2-1.1-3-2.3-1-1.5-1.8-3.9-1.8-6.1 0-3.6 2.3-5.5 4.6-5.5 1.2 0 2.2.8 3 .8.7 0 1.7-.9 3.1-.9.6 0 2.4.1 3.6 1.9-.1 0-2.1 1.2-2.1 3.6zM14.4 4.8c.6-.8 1.1-1.9.9-3-1 .1-2.2.7-2.9 1.5-.6.7-1.1 1.8-1 2.9 1.1.1 2.1-.5 3-1.4z"/>
                  </svg>
                  <span className="text-xs text-white">App Store</span>
                </div>
              </button>
              <button className="bg-black border border-gray-800 rounded-lg px-3 py-2 hover:border-gray-700 transition-colors">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.6 3.4c-.2.3-.4.7-.4 1.2v14.8c0 .5.2.9.5 1.2l.1.1 8.6-8.6v-.2l-8.6-8.6-.2.1zM20.3 10.2l-2.9-1.7-3.4 3.4 3.4 3.4 2.9-1.7c.8-.5 1.2-1.1 1.2-1.7 0-.6-.4-1.2-1.2-1.7zM4.5 20.6l9.4-5.4-2.9-2.9-6.5 8.3zM4.5 3.4l6.5 8.3 2.9-2.9-9.4-5.4z"/>
                  </svg>
                  <span className="text-xs text-white">Google Play</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}