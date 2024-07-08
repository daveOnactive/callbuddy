import { WebRTCContext } from "@/providers"
import { useContext } from "react"

export function useWebRTC() {
  const { localStream, createCall, openUserMedia, remoteStream, joinCall } = useContext(WebRTCContext);

  return {
    localStream,
    createCall,
    openUserMedia,
    remoteStream,
    joinCall
  }
}