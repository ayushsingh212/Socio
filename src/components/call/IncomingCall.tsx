"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  PhoneOff,
  Video,
  Volume2,
  Clock,
  X,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface IncomingCallProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
  callerName: string;
  callerAvatar: string | undefined;
  callType: "audio" | "video";
}

export function IncomingCall({
  isOpen,
  onAccept,
  onDecline,
  callerName,
  callerAvatar,
  callType,
}: IncomingCallProps) {
  const [timeLeft, setTimeLeft] = useState(30);

  // ✅ FIX: Use a ref to hold the current onDecline so the timer effect
  // never has a stale closure, and doesn't need onDecline in its dep array
  // (which would restart the timer every render if onDecline wasn't memoized).
  const onDeclineRef = useRef(onDecline);
  useEffect(() => {
    onDeclineRef.current = onDecline;
  }, [onDecline]);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(30);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onDeclineRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
    // ✅ Only depends on isOpen — timer won't restart on every render
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/90 backdrop-blur-xl z-50"
          />

          {/* Call Card */}
          <motion.div
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md px-4"
          >
            <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-3xl border border-gray-800 overflow-hidden shadow-2xl">
              {/* Animated Background */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-yellow-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000" />

                {/* Animated Rings */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-64 h-64">
                    <div className="absolute inset-0 border-2 border-yellow-400/30 rounded-full animate-ping" />
                    <div className="absolute inset-2 border-2 border-pink-500/30 rounded-full animate-ping animation-delay-300" />
                    <div className="absolute inset-4 border-2 border-purple-500/30 rounded-full animate-ping animation-delay-600" />
                  </div>
                </div>
              </div>

              <div className="relative p-8 text-center">
                {/* Close Button */}
                <button
                  onClick={onDecline}
                  className="absolute top-4 right-4 p-2 bg-gray-800/50 hover:bg-gray-700 rounded-full transition group"
                >
                  <X className="w-4 h-4 text-gray-400 group-hover:text-white" />
                </button>

                {/* Caller Info */}
                <div className="mb-8">
                  <div className="relative inline-block mb-4">
                    {/* Avatar with Pulse Animation */}
                    <div
                      className={cn(
                        "w-32 h-32 rounded-full p-1",
                        callType === "video"
                          ? "bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 animate-spin-slow"
                          : "bg-gradient-to-r from-green-400 to-blue-500 animate-pulse"
                      )}
                    >
                      <div className="w-full h-full rounded-full border-4 border-gray-900 overflow-hidden">
                        <img
                          src={callerAvatar}
                          alt={callerName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Timer Badge */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gray-900/90 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700 shadow-lg">
                      <span className="text-sm font-medium text-white flex items-center gap-2">
                        <Clock
                          className={cn(
                            "w-4 h-4",
                            timeLeft < 10
                              ? "text-red-400 animate-pulse"
                              : "text-yellow-400"
                          )}
                        />
                        {timeLeft}s
                      </span>
                    </div>

                    {/* Call Type Badge */}
                    <div className="absolute -top-2 -right-2">
                      <div
                        className={cn(
                          "p-3 rounded-full shadow-lg",
                          callType === "video"
                            ? "bg-gradient-to-r from-purple-500 to-pink-500"
                            : "bg-gradient-to-r from-green-500 to-blue-500"
                        )}
                      >
                        {callType === "video" ? (
                          <Video className="w-4 h-4 text-white" />
                        ) : (
                          <Phone className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-1">
                    {callerName}
                  </h2>
                  <p className="text-gray-400 text-sm mb-2">
                    {callType === "video"
                      ? "Wants to video call you"
                      : "Wants to audio call you"}
                  </p>

                  {/* Call Quality Indicator */}
                  <div className="flex justify-center gap-1 mt-2">
                    {[1, 2, 3, 4].map((bar) => (
                      <motion.div
                        key={bar}
                        animate={{
                          height: [20, 30, 20],
                          backgroundColor: ["#4ade80", "#fbbf24", "#4ade80"],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: bar * 0.2,
                        }}
                        className="w-1 bg-green-400 rounded-full"
                      />
                    ))}
                    <span className="text-xs text-gray-500 ml-2">
                      Excellent connection
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-6">
                  {/* Decline */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onDecline}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition" />
                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white flex items-center justify-center shadow-xl group-hover:shadow-red-500/50 transition-all">
                      <PhoneOff className="w-6 h-6" />
                    </div>
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap">
                      Decline
                    </span>
                  </motion.button>

                  {/* Accept */}
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onAccept}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition" />
                    <div
                      className={cn(
                        "relative w-20 h-20 rounded-full text-white flex items-center justify-center shadow-xl transition-all",
                        callType === "video"
                          ? "bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 group-hover:shadow-pink-500/50"
                          : "bg-gradient-to-r from-green-500 to-blue-500 group-hover:shadow-green-500/50"
                      )}
                    >
                      {callType === "video" ? (
                        <Video className="w-8 h-8" />
                      ) : (
                        <Phone className="w-8 h-8" />
                      )}
                    </div>
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap">
                      Accept
                    </span>
                  </motion.button>
                </div>

                {/* Footer */}
                <div className="mt-12 flex justify-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Volume2 className="w-3 h-3" />
                    HD Voice
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1 h-1 bg-green-400 rounded-full" />
                    End-to-end encrypted
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}