'use client'
import { createContext, PropsWithChildren, useContext, useEffect, useRef, useState } from "react";
import { addDoc, collection, doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { db } from "@/app/firebase";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthenticationContext } from "./AuthenticationProvider";
import { UserCallStatus } from "@/types";
import { useUpdateDoc } from "@/hooks";
import { timeConvert } from "@/helpers";

export const CallContext = createContext<Partial<{
  remoteStream: MediaStream;
  localStream: MediaStream;
  createCall: () => void;
  joinCall: (id: string) => void;
  callAudio: (id?: string) => void;
  toggleCamera: () => void;
  isMuted: boolean;
  isOffCam: boolean;
  switchCamera: () => void;
  endCall: (id: string, time?: number) => void;
  localStreamRef: any;
  remoteStreamRef: any;
  disconnectStream: () => void;
  callTime: string;
}>>({});

const configuration = {
  iceServers: [
    {
      urls: [
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
      ],
    },
  ],
  iceCandidatePoolSize: 10,
};

export function CallProvider({ children }: PropsWithChildren) {
  const [localStream, setLocalStream] = useState<MediaStream>();
  const [remoteStream, setRemoteStream] = useState<MediaStream>();
  const [isMuted, setIsMuted] = useState(false);
  const [isOffCam, setIsOffCam] = useState(false);
  const [isBackCamera, setIsBackCamera] = useState(false);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection>();
  const [isCallConnected, setIsCallConnected] = useState(false);

  const localStreamRef = useRef<HTMLVideoElement>();
  const callEnded = useRef(false);

  const { user } = useContext(AuthenticationContext);

  const { mutate } = useUpdateDoc('users');

  const { mutate: mutateCall } = useUpdateDoc('calls');

  const { push } = useRouter();

  const params = useSearchParams();

  const callId = params.get('callId') as string;
  const joinCallId = params.get('joinCallId') as string;

  const [seconds, setSeconds] = useState<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    setPeerConnection(new RTCPeerConnection(configuration));
    console.log('Create PeerConnection with configuration: ', configuration);

    return () => {
      peerConnection?.close();
    }
  }, []);

  async function openUserMedia(front = true, isStreaming?: boolean) {
    const constraints = {
      video: { facingMode: front ? "user" : "environment" },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    if (isMuted) {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
    }

    setLocalStream(stream);

    if (localStreamRef?.current) {
      localStreamRef.current.srcObject = stream;
    }

    if (isStreaming && peerConnection) {
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
      });
    }
  }

  useEffect(() => {
    openUserMedia?.();
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    }
  }, []);

  async function endCall(id: string, callTime?: number) {
    callEnded.current = true;

    const time = callTime || seconds;

    const { fromSecToMin } = timeConvert();

    const minutesLeft = time === 0 ? user?.minutesLeft : `${Number(user?.minutesLeft) - fromSecToMin(time)}`;

    mutate(user?.id as string, {
      call: UserCallStatus.NOT_IN_CALL,
      minutesLeft
    });


    mutateCall(id, {
      answer: '',
      offer: '',
      callTime: time,
    });


    setIsCallConnected(false);
    setLocalStream(undefined);
    setRemoteStream(undefined);
    setIsMuted(false);
    setIsBackCamera(false);
    setIsOffCam(false);
    push('/home');
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isCallConnected) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCallConnected]);

  useEffect(() => {
    const { fromMinToSec } = timeConvert();

    if (fromMinToSec(Number(user?.minutesLeft)) === seconds) {
      endCall(callId || joinCallId);
    }
  }, [user, seconds])

  async function createCall(id?: string) {

    if (!peerConnection || !user) {
      return;
    }

    registerPeerConnectionListeners();

    localStream?.getTracks().forEach(track => {
      peerConnection?.addTrack(track, localStream);
    });

    const callRef = doc(db, 'calls', callId);

    mutate(user.id, {
      call: UserCallStatus.CREATE_CALL,
      callId: callRef.id,
    });

    const callerCandidatesCollection = collection(callRef, 'callerCandidates');
    const calleeCandidatesCollection = collection(callRef, 'calleeCandidates');

    peerConnection.addEventListener('icecandidate', event => {
      if (!event.candidate) {
        console.log('Got final candidate!');
        return;
      }
      console.log('Got candidate: ', event.candidate);
      addDoc(callerCandidatesCollection, event.candidate.toJSON());
    });

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    console.log('Created offer:', offer);

    const callWithOffer = {
      'offer': {
        type: offer.type,
        sdp: offer.sdp,
      },
    };

    await setDoc(callRef, callWithOffer);

    peerConnection.addEventListener('track', event => {
      console.log('Got remote track:', event.streams[0]);

      const [remoteStream] = event.streams;
      setRemoteStream(remoteStream);
    });

    onSnapshot(callRef, async snapshot => {
      const data = snapshot.data();
      if (!peerConnection.currentRemoteDescription && data && data.answer) {
        console.log('Got remote description: ', data.answer);
        const rtcSessionDescription = new RTCSessionDescription(data.answer);
        await peerConnection.setRemoteDescription(rtcSessionDescription);

        mutate(user.id, {
          call: UserCallStatus.IN_CALL
        })
      }

      if (peerConnection.currentRemoteDescription && data && !data.answer && !callEnded.current && data.callTime) {
        endCall(callId, data.callTime);
      }
    });

    onSnapshot(calleeCandidatesCollection, snapshot => {
      snapshot.docChanges().forEach(async change => {
        if (change.type === 'added') {
          let data = change.doc.data();
          console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
          await peerConnection.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });

  };

  async function joinCall(id: string) {
    if (!peerConnection || !user) {
      return;
    }

    const callRef = doc(db, 'calls', id);

    const callSnapshot = await getDoc(callRef);

    if (callSnapshot.exists()) {

      registerPeerConnectionListeners();

      localStream?.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });

      peerConnection.addEventListener('track', event => {
        console.log('Got remote track:', event.streams[0]);

        const [remoteStream] = event.streams;
        setRemoteStream(remoteStream);
      });

      const calleeCandidatesCollection = collection(callRef, 'calleeCandidates');
      const callerCandidatesCollection = collection(callRef, 'callerCandidates');

      peerConnection?.addEventListener('icecandidate', event => {
        if (!event.candidate) {
          console.log('Got final candidate!');
          return;
        }
        console.log('Got candidate: ', event.candidate);
        addDoc(calleeCandidatesCollection, event.candidate.toJSON());
      });

      const offer = callSnapshot.data().offer;

      console.log('Got offer:', offer);
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.createAnswer();
      console.log('Created answer:', answer);
      await peerConnection.setLocalDescription(answer);

      const callWithAnswer = {
        answer: {
          type: answer.type,
          sdp: answer.sdp,
        },
      };

      await updateDoc(callRef, callWithAnswer);

      mutate(user.id, {
        call: UserCallStatus.IN_CALL
      });

      onSnapshot(callRef, (snapshot) => {
        const data = snapshot.data();

        if (!data?.offer && !callEnded.current && data?.callTime) {
          endCall(id, data.callTime);
        }
      });

      onSnapshot(callerCandidatesCollection, (snapshot) => {
        snapshot.docChanges().forEach(async change => {
          if (change.type === 'added') {
            let data = change.doc.data();
            console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
            peerConnection.addIceCandidate(new RTCIceCandidate(data));
          }
        });
      })

    }
  };

  function disconnectStream() {
    localStream?.getTracks().forEach(track => track.stop());
  };

  function callAudio() {
    localStream?.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setIsMuted(!track.enabled);
    });
  }

  async function switchCamera() {
    if (isOffCam) return;

    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }

    await openUserMedia(isBackCamera);

    setIsBackCamera(!isBackCamera);
  }

  function toggleCamera() {
    localStream?.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setIsOffCam(!isOffCam);
    });
  }

  function registerPeerConnectionListeners() {
    peerConnection?.addEventListener('icegatheringstatechange', () => {
      console.log(
        `ICE gathering state changed: ${peerConnection.iceGatheringState}`);
    });

    peerConnection?.addEventListener('connectionstatechange', () => {
      console.log(`Connection state change: ${peerConnection.connectionState}`);

      if (peerConnection.iceConnectionState === 'connected') {
        setIsCallConnected(true);
      }
    });

    peerConnection?.addEventListener('signalingstatechange', () => {
      console.log(`Signaling state change: ${peerConnection.signalingState}`);
    });

    peerConnection?.addEventListener('iceconnectionstatechange ', () => {
      console.log(
        `ICE connection state change: ${peerConnection.iceConnectionState}`);
    });
  }


  return (
    <CallContext.Provider
      value={{
        localStream,
        remoteStream,
        createCall,
        joinCall,
        callAudio,
        toggleCamera,
        switchCamera,
        isMuted,
        isOffCam,
        endCall,
        localStreamRef,
        disconnectStream,
        callTime: formatTime(seconds),
      }}
    >
      {children}
    </CallContext.Provider>
  )
}