'use client'
import { createContext, PropsWithChildren, useEffect, useRef, useState } from "react";
import { collection, addDoc, doc, setDoc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from "@/app/firebase";
import { useRouter } from "next/navigation";

export const WebRTCContext = createContext<Partial<{
  remoteStream: MediaStream;
  localStream: MediaStream;
  createCall: () => void;
  joinCall: (id: string) => void;
  callAudio: () => void;
  toggleCamera: () => void;
  isMuted: boolean;
  isOffCam: boolean;
  switchCamera: () => void;
  endCall: () => void;
  localStreamRef: any;
  remoteStreamRef: any;
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

export function WebRTCProvider({ children }: PropsWithChildren) {
  const [callId, setCallId] = useState('idjfhrryiw5wf');
  const [localStream, setLocalStream] = useState<MediaStream>();
  const [remoteStream, setRemoteStream] = useState<MediaStream>();
  const [isMuted, setIsMuted] = useState(false);
  const [isOffCam, setIsOffCam] = useState(false);
  const [isBackCamera, setIsBackCamera] = useState(false);

  const localStreamRef = useRef<HTMLVideoElement>();
  const remoteStreamRef = useRef<HTMLVideoElement>();

  const { push } = useRouter();


  async function openUserMedia(front = true) {
    const constraints = {
      video: { facingMode: front ? "user" : "environment" },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    setLocalStream(stream);

    if (localStreamRef?.current) {
      localStreamRef.current.srcObject = stream;
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

  async function createCall() {

    if (typeof window === "undefined") {
      return;
    }

    const peerConnection = new RTCPeerConnection(configuration);

    registerPeerConnectionListeners(peerConnection);

    localStream?.getTracks().forEach(track => {
      peerConnection?.addTrack(track, localStream);
    });

    const callRef = doc(db, 'calls', callId);

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

      if (remoteStreamRef.current) {
        remoteStreamRef.current.srcObject = remoteStream;
      }
    });

    onSnapshot(callRef, async snapshot => {
      const data = snapshot.data();
      if (!peerConnection.currentRemoteDescription && data && data.answer) {
        console.log('Got remote description: ', data.answer);
        const rtcSessionDescription = new RTCSessionDescription(data.answer);
        await peerConnection.setRemoteDescription(rtcSessionDescription);
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

  async function joinCall(_id: string) {
    if (typeof window === "undefined") {
      return;
    }

    const callRef = doc(db, 'calls', callId);

    const callSnapshot = await getDoc(callRef);

    if (callSnapshot.exists()) {
      const peerConnection = new RTCPeerConnection(configuration);

      console.log('Create PeerConnection with configuration: ', configuration);

      registerPeerConnectionListeners(peerConnection);

      localStream?.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });

      peerConnection.addEventListener('track', event => {
        console.log('Got remote track:', event.streams[0]);

        const [remoteStream] = event.streams;
        setRemoteStream(remoteStream);
        if (remoteStreamRef.current) {
          remoteStreamRef.current.srcObject = remoteStream;
        }
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

  async function endCall() {
    localStream?.getTracks().forEach(track => track.stop());
    setLocalStream(undefined);
    setRemoteStream(undefined);
    setIsMuted(false);
    setIsBackCamera(false);
    setIsOffCam(false);
    push('/home');

    console.log({
      localStream
    })
  };

  function callAudio() {
    // if (!remoteStream) {
    //   return;
    // }
    localStream?.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setIsMuted(!track.enabled);
    });
  }

  async function switchCamera() {
    if (isMuted || isOffCam) return;

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

  function registerPeerConnectionListeners(peerConnection: RTCPeerConnection) {
    peerConnection.addEventListener('icegatheringstatechange', () => {
      console.log(
        `ICE gathering state changed: ${peerConnection.iceGatheringState}`);
    });

    peerConnection.addEventListener('connectionstatechange', () => {
      console.log(`Connection state change: ${peerConnection.connectionState}`);
    });

    peerConnection.addEventListener('signalingstatechange', () => {
      console.log(`Signaling state change: ${peerConnection.signalingState}`);
    });

    peerConnection.addEventListener('iceconnectionstatechange ', () => {
      console.log(
        `ICE connection state change: ${peerConnection.iceConnectionState}`);
    });
  }


  return (
    <WebRTCContext.Provider
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
        localStreamRef
      }}
    >
      {children}
    </WebRTCContext.Provider>
  )
}