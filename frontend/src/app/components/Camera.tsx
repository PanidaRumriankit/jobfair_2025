"use client";

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import ErrorPopup from "@/components/ErrorPopup";

export type CameraHandle = {
  capture: () => string | null;
  switchCamera: () => void; // switch between front and back cameras
};

const Camera = forwardRef<CameraHandle>((props, ref) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user"); // Track camera mode

  useEffect(() => {
    const getCameraStream = async () => {
      try {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
        });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError(true);
      }
    };

    getCameraStream();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  useImperativeHandle(ref, () => ({
    capture: () => {
      if (videoRef.current) {
        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        const context = canvas.getContext("2d");
        if (context) {
          context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          return canvas.toDataURL("image/jpeg"); // Return image as base64
        }
      }
      return null;
    },
    switchCamera: () => {
      setFacingMode((prev) => (prev === "user" ? "environment" : "user")); // Toggle camera
    },
  }));

  return (
    <div className="relative w-full h-screen">
      {error && <ErrorPopup />}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-contain"
      />
    </div>
  );
});

Camera.displayName = "Camera";
export default Camera;