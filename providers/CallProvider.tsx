'use client'
import { createContext, PropsWithChildren, useContext, useEffect, useRef, useState } from "react";
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from "@/app/firebase";
import { useRouter } from "next/navigation";
import { AuthenticationContext } from "./AuthenticationProvider";
import { UserCallStatus } from "@/types";
import { useUpdateDoc } from "@/hooks";

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
  endCall: (id: string) => void;
  localStreamRef: any;
  remoteStreamRef: any;
  disconnectStream: () => void;
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

  const localStreamRef = useRef<HTMLVideoElement>();

  const { user } = useContext(AuthenticationContext);

  const { mutate } = useUpdateDoc('users');

  const { push } = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    setPeerConnection(new RTCPeerConnection(configuration));
    console.log('Create PeerConnection with configuration: ', configuration);
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

  async function createCall(id?: string) {

    if (!peerConnection || !user) {
      return;
    }

    registerPeerConnectionListeners();

    localStream?.getTracks().forEach(track => {
      peerConnection?.addTrack(track, localStream);
    });

    const userRef = doc(db, 'users', user.id);

    const userDoc = (await getDoc(userRef)).data();

    const callerCandidates: any[] = [];

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    console.log('Created offer:', offer);

    const callWithOffer = {
      'offer': {
        type: offer.type,
        sdp: offer.sdp,
      },
    };

    peerConnection.addEventListener('icecandidate', event => {
      if (!event.candidate) {
        console.log('Got final candidate!');

        mutate(user.id, {
          call: {
            ...userDoc?.call,
            ...callWithOffer,
            status: UserCallStatus.CREATE_CALL,
            candidatesCollection: {
              caller: callerCandidates,
            }
          }
        });
        return;
      }
      console.log('Got candidate: ', event.candidate);
      callerCandidates.push(event.candidate.toJSON());
    });

    peerConnection.addEventListener('track', event => {
      console.log('Got remote track:', event.streams[0]);

      const [remoteStream] = event.streams;
      setRemoteStream(remoteStream);
    });

    let iceCandidatesReceived = false;

    onSnapshot(userRef, async snapshot => {
      const data = snapshot.data();

      if (!iceCandidatesReceived && data?.call?.candidatesCollection?.callee) {
        data?.call?.candidatesCollection?.callee.forEach((data: any) => {
          console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
          peerConnection.addIceCandidate(new RTCIceCandidate(data));
        });
        iceCandidatesReceived = true;
      }

      if (!peerConnection.currentRemoteDescription && data && data?.call?.answer) {
        console.log('Got remote description: ', data?.call?.answer);
        const rtcSessionDescription = new RTCSessionDescription(data?.call?.answer);
        await peerConnection.setRemoteDescription(rtcSessionDescription);

        mutate(user.id, {
          call: {
            ...userDoc?.call,
            status: UserCallStatus.IN_CALL,
          }
        });

      }
    })

  };

  async function joinCall(id: string) {
    if (!peerConnection || !user) {
      return;
    }

    const userRef = doc(db, 'users', id);

    const userDocument = await getDoc(userRef);

    const userDoc = userDocument.data();

    if (userDocument.exists()) {

      registerPeerConnectionListeners();

      localStream?.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });

      peerConnection.addEventListener('track', event => {
        console.log('Got remote track:', event.streams[0]);

        const [remoteStream] = event.streams;
        setRemoteStream(remoteStream);
      });

      const calleeCandidates: any[] = [];

      const offer = userDoc?.call.offer;

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

      peerConnection?.addEventListener('icecandidate', event => {
        if (!event.candidate) {
          console.log('Got final candidate!');

          mutate(id, {
            call: {
              ...userDoc?.call,
              ...callWithAnswer,
              status: UserCallStatus.IN_CALL,
              candidatesCollection: {
                ...userDoc?.call?.candidatesCollection,
                callee: calleeCandidates,
              }
            }
          });
          return;
        }
        console.log('Got candidate: ', event.candidate);
        calleeCandidates.push(event.candidate.toJSON());
      });

      mutate(user.id, {
        call: {
          status: UserCallStatus.IN_CALL
        }
      });

      let iceCandidatesReceived = false;

      onSnapshot(userRef, async snapshot => {
        const data = snapshot.data();

        if (!iceCandidatesReceived && data?.call?.candidatesCollection?.caller) {
          data?.call?.candidatesCollection?.caller.forEach((data: any) => {
            console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
            peerConnection.addIceCandidate(new RTCIceCandidate(data));
          });

          iceCandidatesReceived = true;
        }
      })

    }
  };

  function disconnectStream() {
    localStream?.getTracks().forEach(track => track.stop());
  };

  async function endCall(id: string) {

    const userRef = doc(db, 'users', id);

    const userDoc = (await getDoc(userRef)).data();

    if (id === user?.id) {
      mutate(id as string, {
        call: {
          status: UserCallStatus.NOT_IN_CALL
        }
      });
    } else {
      mutate(id, {
        call: {
          ...userDoc?.call,
          status: UserCallStatus.CREATE_CALL,
          answer: '',
          candidatesCollection: {
            ...userDoc?.call?.candidatesCollection,
            callee: [],
          }
        }
      });

      mutate(user?.id as string, {
        call: {
          status: UserCallStatus.NOT_IN_CALL
        }
      });
    }

    localStream?.getTracks().forEach(track => track.stop());
    setLocalStream(undefined);
    setRemoteStream(undefined);
    setIsMuted(false);
    setIsBackCamera(false);
    setIsOffCam(false);
    push('/home');
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
        disconnectStream
      }}
    >
      {children}
    </CallContext.Provider>
  )
}