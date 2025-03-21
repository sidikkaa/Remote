import React, { useState, useEffect, useRef } from "react";
import SimplePeer from "simple-peer";

const VideoCall = () => {
  const [stream, setStream] = useState(null);
  const [peer, setPeer] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [callInProgress, setCallInProgress] = useState(false);
  const [isCaller, setIsCaller] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Use effect to set up local video stream (your webcam)
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.log("Error accessing webcam: ", err));
  }, []);

  // Function to initiate the call (for the caller)
  const startCall = () => {
    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      // Send this signal data to the other peer (via signaling server or direct communication)
      console.log("SIGNAL", data);
    });

    peer.on("stream", (remoteStream) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    });

    setPeer(peer);
    setCallInProgress(true);
    setIsCaller(true);
  };

  // Function to answer the call (for the receiver)
  const answerCall = () => {
    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      // Send this signal data to the caller
      console.log("SIGNAL", data);
    });

    peer.on("stream", (remoteStream) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    });

    peer.signal(peer.signalData); // Signal data should be received from the caller

    setPeer(peer);
    setCallInProgress(true);
    setIsConnected(true);
  };

  return (
    <div>
      <h2>{isCaller ? "Caller" : "Receiver"}</h2>

      {/* Local Video Stream */}
      <video
        ref={localVideoRef}
        autoPlay
        muted
        style={{ width: "300px", borderRadius: "8px" }}
      />

      {/* Remote Video Stream */}
      <video
        ref={remoteVideoRef}
        autoPlay
        style={{ width: "300px", borderRadius: "8px" }}
      />

      {!callInProgress ? (
        <div>
          <button onClick={startCall}>Start Video Call</button>
        </div>
      ) : isCaller ? (
        <p>Waiting for the receiver to join...</p>
      ) : (
        <div>
          <button onClick={answerCall}>Answer Call</button>
        </div>
      )}

      {/* Disconnect button */}
      {isConnected && (
        <button
          onClick={() => {
            peer.destroy();
            setCallInProgress(false);
            setIsConnected(false);
          }}
        >
          Disconnect
        </button>
      )}
    </div>
  );
};

export default VideoCall;















