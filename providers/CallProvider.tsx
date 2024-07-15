'use client'
import { createContext, PropsWithChildren, useContext, useEffect, useRef, useState } from "react";
import { collection, addDoc, doc, setDoc, getDoc, updateDoc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { db } from "@/app/firebase";
import { useRouter } from "next/navigation";
import { AuthenticationContext } from "./AuthenticationProvider";
import { useMutation } from "@tanstack/react-query";
import { Api } from "@/services";
import { User, UserCallStatus } from "@/types";
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
  iceCandidatePoolSize: 100,
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

    const callRef = doc(db, 'calls', id || user.id);

    mutate(user.id, {
      call: UserCallStatus.CREATE_CALL
    })

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
      })

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

  async function endCall(id: string) {

    // peerConnection?.close();

    const callRef = doc(db, 'calls', id);

    mutate(user?.id as string, {
      call: UserCallStatus.NOT_IN_CALL
    });

    if (id === user?.id) {
      await deleteDoc(callRef);
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