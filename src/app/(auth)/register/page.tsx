"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form data
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("");

  const handleNextStep = () => {
    if (step === 1 && !email) {
      setError("Please enter your email");
      return;
    }
    if (step === 2 && (!fullName || !username)) {
      setError("Please fill in all fields");
      return;
    }
    if (step === 3 && (!password || password !== confirmPassword)) {
      setError(password !== confirmPassword ? "Passwords don't match" : "Please enter a password");
      return;
    }
    if (step === 4 && !birthday) {
      setError("Please enter your birthday");
      return;
    }
    
    setError("");
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setError("");
    setStep(step - 1);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!gender) {
      setError("Please select a gender");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          fullName,
          username,
          password,
          birthday,
          gender,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      localStorage.setItem("token", data.token);
      router.push("/");
      
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleSignUp = () => {
    console.log("Google sign up clicked");
  };

  // Step indicators
  const steps = [
    { number: 1, label: "Email" },
    { number: 2, label: "Profile" },
    { number: 3, label: "Password" },
    { number: 4, label: "Birthday" },
    { number: 5, label: "Gender" },
  ];

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
                src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=600&fit=crop" 
                alt="Social media feed preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Right side - Registration form */}
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="text-center mb-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              Socio
            </h1>
          </div>

          {/* Registration card */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
            {/* Step indicator */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                {steps.map((s) => (
                  <div
                    key={s.number}
                    className={`flex-1 h-1 mx-1 rounded-full transition-all ${
                      s.number <= step ? "bg-blue-500" : "bg-gray-800"
                    }`}
                  />
                ))}
              </div>
              <p className="text-center text-xs text-gray-500">
                Step {step} of 5: {steps[step - 1].label}
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {/* Form steps */}
            <form onSubmit={handleSubmit}>
              {/* Step 1 - Email */}
              {step === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="text-center mb-4">
                    <h2 className="text-xl font-semibold text-white">Enter your email</h2>
                    <p className="text-xs text-gray-500 mt-1">You'll use this to sign in</p>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-gray-600 text-sm"
                    autoComplete="email"
                  />
                </div>
              )}

              {/* Step 2 - Profile Info */}
              {step === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="text-center mb-4">
                    <h2 className="text-xl font-semibold text-white">Create your profile</h2>
                    <p className="text-xs text-gray-500 mt-1">Add your name and username</p>
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-gray-600 text-sm"
                    autoComplete="name"
                  />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-gray-600 text-sm"
                    autoComplete="username"
                  />
                </div>
              )}

              {/* Step 3 - Password */}
              {step === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="text-center mb-4">
                    <h2 className="text-xl font-semibold text-white">Create a password</h2>
                    <p className="text-xs text-gray-500 mt-1">Make it strong and memorable</p>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-gray-600 text-sm"
                    autoComplete="new-password"
                  />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-gray-600 text-sm"
                    autoComplete="new-password"
                  />
                  {password && confirmPassword && password !== confirmPassword && (
                    <p className="text-red-400 text-xs">Passwords don't match</p>
                  )}
                </div>
              )}

              {/* Step 4 - Birthday */}
              {step === 4 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="text-center mb-4">
                    <h2 className="text-xl font-semibold text-white">Add your birthday</h2>
                    <p className="text-xs text-gray-500 mt-1">This won't be public</p>
                  </div>
                  <input
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-gray-600 text-sm"
                  />
                  <p className="text-xs text-gray-500">
                    Use your own birthday, even if this account is for a business.
                  </p>
                </div>
              )}

              {/* Step 5 - Gender */}
              {step === 5 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="text-center mb-4">
                    <h2 className="text-xl font-semibold text-white">Select your gender</h2>
                    <p className="text-xs text-gray-500 mt-1">This is optional</p>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setGender("female")}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all ${
                      gender === "female"
                        ? "bg-blue-500/20 border-blue-500 text-white"
                        : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                    }`}
                  >
                    <span>Female</span>
                    {gender === "female" && (
                      <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setGender("male")}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all ${
                      gender === "male"
                        ? "bg-blue-500/20 border-blue-500 text-white"
                        : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                    }`}
                  >
                    <span>Male</span>
                    {gender === "male" && (
                      <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setGender("other")}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all ${
                      gender === "other"
                        ? "bg-blue-500/20 border-blue-500 text-white"
                        : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                    }`}
                  >
                    <span>Other</span>
                    {gender === "other" && (
                      <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex gap-3 mt-6">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-colors text-sm"
                  >
                    Back
                  </button>
                )}
                
                {step < 5 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className={`${
                      step > 1 ? "flex-1" : "w-full"
                    } bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors text-sm`}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className={`${
                      step > 1 ? "flex-1" : "w-full"
                    } bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 text-sm`}
                  >
                    {loading ? "Creating Account..." : "Sign Up"}
                  </button>
                )}
              </div>
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

            {/* Google sign up */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
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

          {/* Sign in link */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mt-4 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-500 font-semibold hover:text-blue-400"
              >
                Sign in
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

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}