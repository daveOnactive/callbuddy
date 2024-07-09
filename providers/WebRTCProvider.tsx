'use client'
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { collection, addDoc, doc, setDoc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from "@/app/firebase";
import { useRouter } from "next/navigation";

export const WebRTCContext = createContext<Partial<{
  remoteStream: MediaStream;
  localStream: MediaStream;
  createCall: () => void;
  openUserMedia: () => void;
  joinCall: (id: string) => void;
  callAudio(): void;
  toggleCamera(): void;
  isMuted: boolean;
  isOffCam: boolean;
  isBackCamera: boolean;
  switchCamera(): void;
  endCall(): void;
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

  const [currentDeviceId, setCurrentDeviceId] = useState<string>();

  const { push } = useRouter();

  async function openUserMedia(deviceId?: string) {
    const constraints = {
      video: deviceId ? { deviceId: { exact: deviceId } } : true,
      audio: true,
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    setLocalStream(stream);
  }

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

  function endCall() {
    if (!localStream) {
      return;
    }
    setLocalStream(undefined);
    setRemoteStream(undefined);
    setIsMuted(false);
    setIsBackCamera(false);
    setIsOffCam(false);
    push('/home');
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

    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      console.log('enumerateDevices() not supported.');
      return;
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');

      if (videoDevices.length > 1) {
        const newDeviceId = videoDevices.find(device => device.deviceId !== currentDeviceId)?.deviceId || videoDevices[0].deviceId;

        if (localStream) {
          localStream.getTracks().forEach(track => track.stop());
        }

        setCurrentDeviceId(newDeviceId);
        await openUserMedia(newDeviceId);
      }
    } catch (error) {
      console.error('Error switching camera.', error);
    }
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
        openUserMedia,
        joinCall,
        callAudio,
        toggleCamera,
        switchCamera,
        isMuted,
        isOffCam,
        isBackCamera,
        endCall,
      }}
    >
      {children}
    </WebRTCContext.Provider>
  )
}