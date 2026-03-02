"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/store/auth.store";

export const SocketContext = createContext<Socket | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const socketRef = useRef<Socket | null>(null);

  // FIX #1: Use state (not just ref) so consumers re-render when socket is ready
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!user?.user?.data?._id) return;

    if (socketRef.current?.connected) return;

    const s = io("http://localhost:8000", {
      transports: ["websocket"],
      withCredentials: true,
      autoConnect: true,
    });

    socketRef.current = s;

    s.on("connect", () => {
      console.log("Socket connected:", s.id);

      // Register user for video calling
      s.emit("video:register", {
        userId: user.user.data._id,
        email: user.user.data.email,
      });

      setSocket(s);
    });

    s.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      setSocket(null);
    });

    s.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    return () => {
      s.disconnect();
      socketRef.current = null;
      setSocket(null);
    };
  }, [user?.user?.data?._id]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  return useContext(SocketContext);
};