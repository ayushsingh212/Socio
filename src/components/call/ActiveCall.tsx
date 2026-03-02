"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Mic, MicOff, Camera, CameraOff, PhoneOff } from "lucide-react";

interface Participant {
  id: string;
  name: string;
  avatar: string;
}

interface ActiveCallProps {
  isOpen: boolean;
  onEnd: () => void;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  callType: "audio" | "video";
  isMuted: boolean;
  isVideoEnabled: boolean;
  participant: Participant;
  localStream?: MediaStream;
  remoteStream?: MediaStream;
  callDuration: number;
  connectionQuality: "excellent" | "good" | "poor" | "disconnected";
}

const CONTROLS_HIDE_DELAY = 3000;

export function ActiveCall({
  isOpen,
  onEnd,
  onToggleMute,
  onToggleVideo,
  callType,
  isMuted,
  isVideoEnabled,
  participant,
  localStream,
  remoteStream,
  callDuration,
  connectionQuality,
}: ActiveCallProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const [showControls, setShowControls] = useState(true);
  const hideTimer = useRef<NodeJS.Timeout>();

  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);

    if (callType === "video") {
      hideTimer.current = setTimeout(() => {
        setShowControls(false);
      }, CONTROLS_HIDE_DELAY);
    }
  }, [callType]);

  useEffect(() => {
    resetHideTimer();
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [resetHideTimer]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Attach local stream
  useEffect(() => {
    const video = localVideoRef.current;
    if (!video) return;

    if (localStream) {
      video.srcObject = localStream;
      video.muted = true;
      video.play().catch(() => {});
    }
  }, [localStream]);

  // Attach remote stream
  useEffect(() => {
    const video = remoteVideoRef.current;
    if (!video) return;

    if (!remoteStream) {
      video.srcObject = null;
      return;
    }

    // Prevent unnecessary reassignments
    if (video.srcObject !== remoteStream) {
      video.srcObject = remoteStream;
    }

    // ✅ Must NOT be muted — remote audio must play
    video.muted = false;
    video.play().catch(() => {});

    const handleTrackEnd = () => {
      if (video) video.srcObject = null;
    };

    remoteStream.getTracks().forEach((track) => {
      track.addEventListener("ended", handleTrackEnd);
    });

    return () => {
      remoteStream.getTracks().forEach((track) => {
        track.removeEventListener("ended", handleTrackEnd);
      });
    };
  }, [remoteStream]);

  if (!isOpen) return null;

  const hasRemoteVideo =
    !!remoteStream &&
    remoteStream.getVideoTracks().some((t) => t.readyState === "live");

  return (
    <div
      className="fixed inset-0 bg-black z-50 flex flex-col"
      onMouseMove={resetHideTimer}
      onTouchStart={resetHideTimer}
    >
      {/* Top Bar */}
      <div
        className={`flex justify-between items-center p-4 text-white bg-black/60 backdrop-blur transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">
            {formatDuration(callDuration)}
          </span>
          <span className="text-xs capitalize">{connectionQuality}</span>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative">
        {/* Remote Video */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className={`w-full h-full object-cover ${
            hasRemoteVideo ? "block" : "hidden"
          }`}
        />

        {/* Fallback Avatar when no remote video */}
        {!hasRemoteVideo && (
          <div className="w-full h-full flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <img
                src={participant.avatar || undefined}
                alt={participant.name}
                className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
              />
              <p className="text-white text-lg">{participant.name}</p>
            </div>
          </div>
        )}

        {/* Local Preview (video calls only) */}
        {callType === "video" && (
          <div className="absolute bottom-24 right-4 w-40 h-56 rounded-lg overflow-hidden border border-gray-700 shadow-lg">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${
                isVideoEnabled ? "block" : "hidden"
              }`}
            />
            {!isVideoEnabled && (
              <div className="w-full h-full flex items-center justify-center bg-gray-800">
                <CameraOff className="text-gray-500" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      <div
        className={`flex justify-center gap-6 p-6 bg-black/70 backdrop-blur transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <button
          onClick={onToggleMute}
          className={`p-4 rounded-full ${
            isMuted ? "bg-red-500" : "bg-gray-700"
          } text-white`}
        >
          {isMuted ? <MicOff /> : <Mic />}
        </button>

        {callType === "video" && (
          <button
            onClick={onToggleVideo}
            className={`p-4 rounded-full ${
              isVideoEnabled ? "bg-gray-700" : "bg-red-500"
            } text-white`}
          >
            {isVideoEnabled ? <Camera /> : <CameraOff />}
          </button>
        )}

        <button
          onClick={onEnd}
          className="p-4 rounded-full bg-red-600 text-white"
        >
          <PhoneOff />
        </button>
      </div>
    </div>
  );
}