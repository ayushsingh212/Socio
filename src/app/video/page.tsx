"use client"

import { useEffect, useRef, useState } from "react"
import { useSocket } from "@/context/SocketContext"
import { useAuthStore } from "@/store/auth.store"

export default function SimpleVideoCall() {
  const socket = useSocket()
  const { user } = useAuthStore()
  const email: string = user?.user?.data?.email ?? ""

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  const peerRef = useRef<RTCPeerConnection | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)

  const [remoteEmail, setRemoteEmail] = useState("")
  const [incomingCall, setIncomingCall] = useState<any>(null)

  const configuration = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" }
    ]
  }

  useEffect(() => {
    if (!socket) return

    socket.emit("video:register", { email })

    socket.on("incoming:call", ({ fromEmail, offer }: { fromEmail: string; offer: RTCSessionDescriptionInit }) => {
      setIncomingCall({ fromEmail, offer })
    })

    socket.on("call:accepted", async ({ ans }: { ans: RTCSessionDescriptionInit }) => {
      await peerRef.current?.setRemoteDescription(new RTCSessionDescription(ans))
    })

    socket.on("ice:candidate", async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
      if (candidate) {
        await peerRef.current?.addIceCandidate(new RTCIceCandidate(candidate))
      }
    })

    socket.on("call:end", endCall)

    return () => {
      socket.off("incoming:call")
      socket.off("call:accepted")
      socket.off("ice:candidate")
      socket.off("call:end")
    }
  }, [socket, email])

  const createPeerConnection = () => {
    const peer = new RTCPeerConnection(configuration)

    peer.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0]
      }
    }

    peer.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit("ice:candidate", {
          toEmail: remoteEmail,
          candidate: event.candidate
        })
      }
    }

    peerRef.current = peer
    return peer
  }

  const startMedia = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    })

    localStreamRef.current = stream

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream
    }

    return stream
  }

  const callUser = async () => {
    if (!socket) return
    const stream = await startMedia()
    const peer = createPeerConnection()

    stream.getTracks().forEach(track => {
      peer.addTrack(track, stream)
    })

    const offer = await peer.createOffer()
    await peer.setLocalDescription(offer)

    socket.emit("user:call", {
      toEmail: remoteEmail,
      offer,
      callType: "video"
    })
  }

  const acceptCall = async () => {
    if (!socket || !incomingCall) return
    const { fromEmail, offer } = incomingCall
    setRemoteEmail(fromEmail)

    const stream = await startMedia()
    const peer = createPeerConnection()

    stream.getTracks().forEach(track => {
      peer.addTrack(track, stream)
    })

    await peer.setRemoteDescription(new RTCSessionDescription(offer))

    const answer = await peer.createAnswer()
    await peer.setLocalDescription(answer)

    socket.emit("call:accepted", {
      toEmail: fromEmail,
      ans: answer
    })

    setIncomingCall(null)
  }

  const endCall = () => {
    peerRef.current?.close()
    peerRef.current = null

    localStreamRef.current?.getTracks().forEach(track => track.stop())

    if (localVideoRef.current) localVideoRef.current.srcObject = null
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null
  }

  return (
    <div className="p-4 space-y-4">
      <input
        placeholder="Enter user email"
        value={remoteEmail}
        onChange={(e) => setRemoteEmail(e.target.value)}
        className="border p-2 w-full"
      />

      <button
        onClick={callUser}
        className="bg-blue-500 text-white px-4 py-2"
      >
        Call
      </button>

      {incomingCall && (
        <div className="bg-gray-200 p-3">
          <p>Incoming call from {incomingCall.fromEmail}</p>
          <button
            onClick={acceptCall}
            className="bg-green-500 text-white px-3 py-1 mt-2"
          >
            Accept
          </button>
        </div>
      )}

      <div className="flex gap-4">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="w-1/2 bg-black"
        />
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-1/2 bg-black"
        />
      </div>
    </div>
  )
}