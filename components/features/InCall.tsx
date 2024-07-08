'use client';
import { Box } from "@mui/material";
import { CallActions } from "../molecules";
import { pink } from "@mui/material/colors";
import { useWebRTC } from "@/hooks";
import { useEffect, useRef } from "react";
import { useSearchParams } from 'next/navigation';

export function InCall() {
  const { localStream, createCall, openUserMedia, remoteStream, joinCall } = useWebRTC();

  const localStreamRef = useRef<HTMLVideoElement>();
  const remoteStreamRef = useRef<HTMLVideoElement>();

  const isMounted = useRef(false);

  const params = useSearchParams();

  const joinCallId = params.get('joinCallId') as string

  const isJoinCall = !!joinCallId;

  useEffect(() => {
    if (localStreamRef?.current && localStream) {
      localStreamRef.current.srcObject = localStream as MediaProvider;
    }
  }, [localStream])

  useEffect(() => {
    if (remoteStreamRef?.current) {
      remoteStreamRef.current.srcObject = remoteStream as MediaProvider;
    }
  }, [remoteStream])

  useEffect(() => {
    openUserMedia?.();
  }, []);

  useEffect(() => {
    if (!isJoinCall && localStream && isMounted.current === false) {
      createCall?.();
      isMounted.current = true;
    }
  }, [localStream])

  useEffect(() => {
    if (localStream && isJoinCall && isMounted.current === false) {
      joinCall?.(joinCallId);
      isMounted.current = true;
    }

  }, [localStream])

  return (
    <Box sx={{
      width: '100%',
      height: '100vh',
      position: 'relative'
    }}>
      <Box
        component={'video'}
        ref={localStreamRef}
        autoPlay
        playsInline
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />

      <Box
        component={'video'}
        ref={remoteStreamRef}
        autoPlay
        playsInline
        sx={{
          position: 'absolute',
          top: '5%',
          right: '5%',
          width: '35%',
          height: '30%',
          objectFit: 'cover',
          borderRadius: '8px'
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          top: '5%',
          left: '5%',
          padding: 1,
          background: pink[500],
          borderRadius: 100,
          fontSize: '.5rem',
          fontWeight: 'bold',
          color: 'white'
        }}
      >
        15m
      </Box>

      <CallActions />
    </Box>
  )
}