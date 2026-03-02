"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { useAuthStore } from "@/store/auth.store";
import { IncomingCall } from "@/components/call/IncomingCall";
import { ActiveCall } from "@/components/call/ActiveCall";
import { useSocket } from "./SocketContext";
import api from "@/lib/axios";
import { key } from "@/search/page";

interface CallUser {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  email: string;
}

interface CallState {
  participants: CallUser[];
  type: "audio" | "video";
  status: "calling" | "incoming" | "connecting" | "connected";
  isMuted: boolean;
  isVideoEnabled: boolean;
  connectionQuality: "excellent" | "good" | "poor" | "disconnected";
  localStream?: MediaStream;
}

interface IncomingCallState {
  from: CallUser;
  type: "audio" | "video";
  offer: RTCSessionDescriptionInit;
}

const CallContext = createContext<any>(null);

export function CallProvider({ children }: { children: React.ReactNode }) {
  const socket = useSocket();
  const { user } = useAuthStore();


  const [activeCall, setActiveCall] = useState<CallState | null>(null);
  const [incomingCall, setIncomingCall] = useState<IncomingCallState | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [callDuration, setCallDuration] = useState(0);

  const peerRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const iceCandidateBuffer = useRef<RTCIceCandidateInit[]>([]);

  const isInitiatingRef = useRef(false);

  const fetchIceServers = useCallback(async () => {
    try {
      const res = await fetch(
        `https://ayu-vc.metered.live/api/v1/turn/credentials?apiKey=${key}`
      );
      return await res.json();
    } catch {
      return [{ urls: "stun:stun.l.google.com:19302" }];
    }
  }, []);

  const createPeer = useCallback(
    (remoteEmail: string, iceServers: RTCIceServer[]) => {
      const pc = new RTCPeerConnection({ iceServers });

      pc.onicecandidate = (event) => {
        if (!socket) return;
        if (event.candidate) {
          socket.emit("ice:candidate", {
            toEmail: remoteEmail,
            candidate: event.candidate.toJSON(),
          });
        }
      };

      pc.ontrack = (event) => {
        const [stream] = event.streams;
        if (stream) setRemoteStream(stream);
      };

      pc.oniceconnectionstatechange = () => {
        const state = pc.iceConnectionState;
        const quality =
          state === "connected" || state === "completed"
            ? "excellent"
            : state === "checking"
            ? "good"
            : state === "disconnected"
            ? "poor"
            : "disconnected";

        setActiveCall((prev) =>
          prev ? { ...prev, connectionQuality: quality } : null
        );
      };

      // FIX #3: Guard against firing during initial addTrack calls
      pc.onnegotiationneeded = async () => {
        if (isInitiatingRef.current) return;
        try {
          if (!socket) return;
          console.log("Renegotiation needed, sending new offer");
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit("peer:nego:needed", {
            toEmail: remoteEmail,
            offer: { type: offer.type, sdp: offer.sdp },
          });
        } catch (err) {
          console.error("onnegotiationneeded error:", err);
        }
      };

      return pc;
    },
    [socket]
  );

  // Helper to flush buffered ICE candidates after remote description is set
  const flushIceCandidates = useCallback(async () => {
    if (!peerRef.current) return;
    const buffered = iceCandidateBuffer.current.splice(0);
    for (const candidate of buffered) {
      try {
        await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("Error flushing ICE candidate:", err);
      }
    }
  }, []);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setCallDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
  };

  // FIX #5: Clear ICE buffer on cleanup
  const cleanup = useCallback(() => {
    peerRef.current?.close();
    peerRef.current = null;

    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;

    if (timerRef.current) clearInterval(timerRef.current);

    // FIX #5: Reset ICE buffer
    iceCandidateBuffer.current = [];
    isInitiatingRef.current = false;

    setActiveCall(null);
    setIncomingCall(null);
    setRemoteStream(null);
    setCallDuration(0);
  }, []);

  const initiateCall = async (target: CallUser, type: "audio" | "video",roomId:string) => {
    const iceServers = await fetchIceServers();
    localStreamRef.current = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: type === "video",
    });


    const pc = createPeer(target.email, iceServers);
    peerRef.current = pc;

    // FIX #3: Suppress onnegotiationneeded while we manually set up the call
    isInitiatingRef.current = true;

    localStreamRef.current.getTracks().forEach((track) =>
      pc.addTrack(track, localStreamRef.current!)
    );

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    // FIX #3: Re-enable negotiation handler for future renegotiations
    isInitiatingRef.current = false;

    setActiveCall({
      participants: [target],
      type,
      status: "calling",
      isMuted: false,
      isVideoEnabled: type === "video",
      connectionQuality: "good",
      localStream: localStreamRef.current,
    });

     socket!.emit("room:",{email:user.user.data.email,roomId})

    socket!.emit("user:call", {
      toEmail: target.email,
      offer: { type: offer.type, sdp: offer.sdp },
      callType: type,
    });
  };

  const acceptCall = async () => {
    if (!incomingCall) return;

      
    const iceServers = await fetchIceServers();

    localStreamRef.current = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: incomingCall.type === "video",
    });

    const pc = createPeer(incomingCall.from.email, iceServers);
    peerRef.current = pc;

    // FIX #3: Suppress onnegotiationneeded during initial track setup
    isInitiatingRef.current = true;

    localStreamRef.current.getTracks().forEach((track) =>
      pc.addTrack(track, localStreamRef.current!)
    );

    await pc.setRemoteDescription(
      new RTCSessionDescription(incomingCall.offer)
    );

    // FIX #4: Flush any ICE candidates that arrived before remote description
    await flushIceCandidates();

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    // FIX #3: Re-enable for future renegotiations
    isInitiatingRef.current = false;

      socket.emit("room:join",{})

    socket!.emit("call:accepted", {
      toEmail: incomingCall.from.email,
      ans: { type: answer.type, sdp: answer.sdp },
    });

    setActiveCall({
      participants: [incomingCall.from],
      type: incomingCall.type,
      status: "connecting",
      isMuted: false,
      isVideoEnabled: incomingCall.type === "video",
      connectionQuality: "good",
      localStream: localStreamRef.current,
    });

    setIncomingCall(null);
  };

  const endCall = useCallback(() => {
    if (!activeCall) return;
    socket?.emit("call:end", {
      toEmail: activeCall.participants[0].email,
    });
    cleanup();
  }, [activeCall, socket, cleanup]);

  const toggleMute = () => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setActiveCall((prev) =>
      prev ? { ...prev, isMuted: !track.enabled } : null
    );
  };

  const toggleVideo = () => {
    const track = localStreamRef.current?.getVideoTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setActiveCall((prev) =>
      prev ? { ...prev, isVideoEnabled: track.enabled } : null
    );
  };

  // FIX #6: Memoize decline handler to prevent infinite re-renders in IncomingCall timer
  const handleDeclineCall = useCallback(() => {
    setIncomingCall(null);
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("incoming:call", async ({ fromEmail, offer, callType }) => {
      try {
        const res = await api.get(`/user/email/${fromEmail}`, {
          withCredentials: true,
        });
        const caller = res.data.data;
        setIncomingCall({ from: caller, offer, type: callType });
      } catch (err) {
        console.error("Failed to fetch caller info:", err);
      }
    });

    socket.on("call:accepted", async ({ ans }) => {
      if (!peerRef.current) return;
      await peerRef.current.setRemoteDescription(
        new RTCSessionDescription(ans)
      );
      // FIX #4: Flush buffered ICE candidates after remote description is set
      await flushIceCandidates();

      setActiveCall((prev) =>
        prev ? { ...prev, status: "connected" } : null
      );
      startTimer();
    });

    socket.on("peer:nego:needed", async ({ fromEmail, offer }) => {
      if (!peerRef.current) return;
      await peerRef.current.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      const answer = await peerRef.current.createAnswer();
      await peerRef.current.setLocalDescription(answer);
      socket.emit("peer:nego:done", {
        toEmail: fromEmail,
        ans: { type: answer.type, sdp: answer.sdp },
      });
    });

    socket.on("peer:nego:final", async ({ ans }) => {
      if (!peerRef.current) return;
      await peerRef.current.setRemoteDescription(
        new RTCSessionDescription(ans)
      );
    });

    // FIX #4: Buffer ICE candidates if remote description not yet set
    socket.on("ice:candidate", async ({ candidate }) => {
      if (!peerRef.current) return;
      if (!peerRef.current.remoteDescription) {
        iceCandidateBuffer.current.push(candidate);
      } else {
        try {
          await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.error("Error adding ICE candidate:", err);
        }
      }
    });

    socket.on("call:end", cleanup);
    socket.on("call:cancelled", cleanup);

    return () => {
      socket.off("incoming:call");
      socket.off("call:accepted");
      socket.off("peer:nego:needed");
      socket.off("peer:nego:final");
      socket.off("ice:candidate");
      socket.off("call:end");
      socket.off("call:cancelled");
    };
  }, [socket, cleanup, flushIceCandidates]);

  return (
    <CallContext.Provider
      value={{
        initiateCall,
        acceptCall,
        endCall,
        toggleMute,
        toggleVideo,
        activeCall,
        incomingCall,
      }}
    >
      {children}

      {/* FIX #6: Pass memoized handler to prevent infinite timer re-renders */}
      <IncomingCall
        isOpen={!!incomingCall}
        onAccept={acceptCall}
        onDecline={handleDeclineCall}
        callerName={incomingCall?.from.fullName || ""}
        callerAvatar={incomingCall?.from.avatar}
        callType={incomingCall?.type || "audio"}
      />

      {activeCall && (
        <ActiveCall
          isOpen
          onEnd={endCall}
          onToggleMute={toggleMute}
          onToggleVideo={toggleVideo}
          callType={activeCall.type}
          isMuted={activeCall.isMuted}
          isVideoEnabled={activeCall.isVideoEnabled}
          participant={{
            id: activeCall.participants[0].id,
            name: activeCall.participants[0].fullName,
            avatar: activeCall.participants[0].avatar,
          }}
          localStream={activeCall.localStream}
          remoteStream={remoteStream ?? undefined}
          callDuration={callDuration}
          connectionQuality={activeCall.connectionQuality}
        />
      )}
    </CallContext.Provider>
  );
}

export const useCall = () => {
  const ctx = useContext(CallContext);
  if (!ctx) throw new Error("useCall must be used inside CallProvider");
  return ctx;
};