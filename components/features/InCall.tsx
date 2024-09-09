'use client';
import { Box, Typography } from "@mui/material";
import { CallActions } from "../molecules";
import { useContext, useEffect, useRef, useState } from "react";
import { useSearchParams } from 'next/navigation';
import { CallContext } from "@/providers";
import { CallTimer } from "../molecules/CallTimer";

export function InCall() {
  const {
    localStream,
    createCall,
    remoteStream,
    joinCall,
    isMuted,
    callAudio,
    isOffCam,
    toggleCamera,
    switchCamera,
    endCall,
    localStreamRef,
    disconnectStream,
    callTime
  } = useContext(CallContext);

  const [windowHeight, setWindowHeight] = useState(0);

  const isMounted = useRef(false);

  const [isHidden, setIsHidden] = useState(false);

  const params = useSearchParams();

  const remoteStreamRef = useRef<HTMLVideoElement>();

  const joinCallId = params.get('joinCallId') as string;
  const callId = params.get('callId') as string;

  const isJoinCall = !!joinCallId;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsHidden(true);
    }, 10000);

    document.addEventListener('click', () => {
      setIsHidden(false);
    })

    return () => {
      clearTimeout(timeout)
    }
  }, [isHidden]);

  useEffect(() => {
    if (remoteStreamRef.current && remoteStream) {
      remoteStreamRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  useEffect(() => {
    if (!isJoinCall && localStream && isMounted.current === false) {
      createCall?.();
      isMounted.current = true;
    }

    return () => {
      disconnectStream?.();
    }
  }, [localStream])

  useEffect(() => {
    if (localStream && isJoinCall && isMounted.current === false) {
      joinCall?.(joinCallId);
      isMounted.current = true;
    }

    return () => {
      disconnectStream?.();
    }
  }, [localStream]);

  useEffect(() => {

    if (windowHeight === 0 && window) {
      setWindowHeight(window.innerHeight);
    }

    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  function handleEndCall() {
    endCall?.(callId || joinCallId)
  }

  const localStreamBoxStyle = {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  }

  const remoteStreamBoxStyle = {
    position: 'absolute',
    top: '5%',
    right: '5%',
    width: '35%',
    height: '30%',
    objectFit: 'cover',
    borderRadius: '8px',
    zIndex: 3
  }

  return (
    <Box sx={{
      width: '100%',
      height: windowHeight,
      position: 'relative'
    }}>
      <Box
        component={'video'}
        ref={localStreamRef}
        autoPlay
        playsInline
        muted
        sx={remoteStream ? remoteStreamBoxStyle : localStreamBoxStyle}
      />

      <Box
        component={'video'}
        ref={remoteStreamRef}
        autoPlay
        playsInline
        sx={remoteStream ? localStreamBoxStyle : remoteStreamBoxStyle}
      />

      <CallTimer
        callTime={callTime}
      />

      <CallActions
        actions={{
          isMuted: !!isMuted,
          isOffCam: !!isOffCam
        }}
        toggleMic={callAudio}
        toggleCamera={toggleCamera}
        switchCamera={switchCamera}
        endCall={handleEndCall}
        isHidden={isHidden}
      />

      {
        !remoteStream ? (
          <Typography variant="body1" sx={{
            position: 'absolute',
            top: '50%',
            textAlign: 'center',
            left: '50%',
            transform: 'translateX(-50%)',
            width: "100%"
          }}>Waiting for your buddy to join the call...</Typography>
        ) : null
      }
    </Box>
  )
}