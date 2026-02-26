"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { forgotPassword, verifyResetOTP, resetPasswordOtp, resetPasswordLink, sendOtp } from "@/services/auth.service";
import { PASSWORD_REGEX } from "@/constants";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [method, setMethod] = useState<"email" | "otp">("email");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateEmail = (email: string) => {
    if (!email) return "Please enter your email";
    if (!EMAIL_REGEX.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (pass: string) => {
    if (!pass) return "Please enter a new password";
    if (pass.length < 8) return "Password must be at least 8 characters";
    if (!PASSWORD_REGEX.test(pass)) return "Password must contain uppercase, lowercase, and special character";
    return "";
  };

  const validateConfirmPassword = (pass: string, confirm: string) => {
    if (!confirm) return "Please confirm your password";
    if (pass !== confirm) return "Passwords don't match";
    return "";
  };

  const handleSendResetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // const res = await forgotPassword(email, "email");
       const res = await resetPasswordLink({email})

      if (!res?.data.success) {
        throw new Error(res.data.message || "Failed to send reset link");
      }

      setSuccess("Password reset link has been sent to your email");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // const res = await forgotPassword(email, "otp");
      
      const res = await sendOtp({email,purpose:"reset"})
      console.log("here is the res",res)
      // if (!res.data?.success) {
      //   throw new Error("Failed to send OTP");
      // }

      setSuccess("OTP has been sent to your email");
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await verifyResetOTP({email,otp,purpose:"reset"});
      
      if (!res.data.success) {
        throw new Error(res?.data?.message || "Invalid OTP");
      }

      setSuccess("OTP verified successfully");
      setStep(3);
    } catch (err: any) {
      setError(err.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const passwordError = validatePassword(newPassword) || validateConfirmPassword(newPassword, confirmPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await resetPasswordOtp({newPassword,
        confirmNewPassword:confirmPassword
      });
      
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to reset password");
      }

      setSuccess("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await forgotPassword(email, "otp");
      
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to resend OTP");
      }

      setSuccess("OTP resent successfully");
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
        
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

        <div className="w-full max-w-sm">
          <div className="text-center mb-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              Socioo
            </h1>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-white">Reset Password</h2>
              <p className="text-xs text-gray-500 mt-1">
                {step === 1 && "Choose how you want to reset your password"}
                {step === 2 && "Enter the OTP sent to your email"}
                {step === 3 && "Create a new password"}
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm p-3 rounded-lg mb-4">
                {success}
              </div>
            )}

            {step === 1 && (
              <>
                <div className="flex gap-3 mb-6">
                  <button
                    type="button"
                    onClick={() => setMethod("email")}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                      method === "email"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    }`}
                  >
                    Email Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod("otp")}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                      method === "otp"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    }`}
                  >
                    OTP Verification
                  </button>
                </div>

                {method === "email" ? (
                  <form onSubmit={handleSendResetLink} className="space-y-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-gray-600 text-sm"
                      autoComplete="email"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 text-sm"
                    >
                      {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleSendOTP} className="space-y-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-gray-600 text-sm"
                      autoComplete="email"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 text-sm"
                    >
                      {loading ? "Sending..." : "Send OTP"}
                    </button>
                  </form>
                )}
              </>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit OTP"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-gray-600 text-sm text-center tracking-widest"
                  maxLength={6}
                />
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 text-sm"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>

                <div className="flex items-center justify-between mt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-sm text-gray-500 hover:text-gray-400"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={loading}
                    className="text-sm text-blue-500 hover:text-blue-400 disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-gray-600 text-sm"
                  autoComplete="new-password"
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm New Password"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-gray-600 text-sm"
                  autoComplete="new-password"
                />
                
                {newPassword && !PASSWORD_REGEX.test(newPassword) && (
                  <p className="text-red-400 text-xs">
                    Password must be 8+ chars with uppercase, lowercase, and special character
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 text-sm"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full text-sm text-gray-500 hover:text-gray-400 mt-2"
                >
                  Back
                </button>
              </form>
            )}

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-gray-900 px-4 text-gray-500">OR</span>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/login"
                className="text-sm text-blue-500 hover:text-blue-400"
              >
                Back to Login
              </Link>
            </div>
          </div>

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
        </div>
      </div>
    </div>
  );
}