"use client";

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import ErrorPopup from "@/components/ErrorPopup";

export type CameraHandle = {
  capture: () => string | null;
  switchCamera: () => void;
  getVideoElement: () => HTMLVideoElement | null;
};

const Camera = forwardRef<CameraHandle>((props, ref) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

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
        console.error("Error accessing camera:", err);
        setErrorMessage("Failed to access camera. Please check permissions.");
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
          return canvas.toDataURL("image/jpeg");
        }
      }
      return null;
    },
    switchCamera: () => {
      setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    },
    getVideoElement: () => {
      return videoRef.current;
    },
  }));

  return (
    <div className="relative w-full h-screen">
      {errorMessage && (
        <ErrorPopup message={errorMessage} onClose={() => setErrorMessage(null)} isOpen={!!errorMessage} />
      )}
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