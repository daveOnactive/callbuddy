'use client'
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { collection, addDoc, doc, setDoc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from "@/app/firebase";

export const WebRTCContext = createContext<Partial<{
  remoteStream: MediaStream;
  localStream: MediaStream;
  createCall: () => void;
  openUserMedia: () => void;
  joinCall: (id: string) => void;
}>>({});

const constraints = { video: true, audio: false };

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

  async function openUserMedia() {
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

  };

  function callAudio() {

  }

  function callVideo() {

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
      }}
    >
      {children}
    </WebRTCContext.Provider>
  )
}