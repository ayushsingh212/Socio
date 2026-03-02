"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Video,
  X,
} from "lucide-react";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  useClick,
  useDismiss,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { useCall } from "@/context/CallContext";

interface CallButtonProps {
  userId: string;
  username: string;
  userAvatar: string;
  roomId:string;
  userFullName?: string;
  userEmail: string;
  onStartCall?: (type: "audio" | "video") => void;
}

export function CallButton({
  userId,
  username,
  userAvatar,
  roomId,
  userFullName,
  userEmail,
  
}: CallButtonProps) {
  const [open, setOpen] = useState(false);
  const { initiateCall, activeCall } = useCall();

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: "bottom-end",
    middleware: [
      offset(8),
      flip(),
      shift({ padding: 8 }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context, { outsidePress: true });
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  const isInCall = false;

  const handleStartCall = (type: "audio" | "video") => {
    if (activeCall) return;

    const user = {
      id: userId,
      username,
      fullName: userFullName || username,
      avatar: userAvatar,
      email: userEmail ,
    };

    // if (onStartCall) {
    //   onStartCall(type);
    // } else {
      initiateCall(user, type,roomId);
    // }

    setOpen(false);
  };

  return (
    <>
    
      <button
        ref={refs.setReference}
        {...getReferenceProps()}
        className={`relative p-2.5 rounded-full transition-all duration-300 shadow-lg
          ${
            isInCall
              ? "bg-green-500 text-white animate-pulse"
              : "bg-gradient-to-r from-yellow-400 to-pink-600 text-gray-900 hover:scale-110 active:scale-95"
          }
        `}
      >
        <Phone className="w-5 h-5" />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && !isInCall && (
          <motion.div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.15 }}
            className="z-50 w-64 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden"
          >
            {/* User Preview */}
            <div className="p-3 border-b border-gray-800 flex items-center gap-3">
              <img
                src={userAvatar}
                alt={username}
                className="w-10 h-10 rounded-full object-cover border border-gray-700"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {userFullName || username}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  @{username}
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1 hover:bg-gray-800 rounded-md"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Options */}
            <div className="p-2 space-y-1">
              <button
                onClick={() => handleStartCall("audio")}
                className="w-full px-3 py-3 text-left rounded-lg hover:bg-gray-800 flex items-center gap-3 transition"
              >
                <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                  <Phone className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    Voice Call
                  </p>
                  <p className="text-xs text-gray-500">
                    Audio only
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleStartCall("video")}
                className="w-full px-3 py-3 text-left rounded-lg hover:bg-gray-800 flex items-center gap-3 transition"
              >
                <div className="w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center">
                  <Video className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    Video Call
                  </p>
                  <p className="text-xs text-gray-500">
                    Face to face
                  </p>
                </div>
              </button>
            </div>

            <div className="p-2 border-t border-gray-800 text-center text-xs text-gray-500">
              Secure end-to-end call
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}