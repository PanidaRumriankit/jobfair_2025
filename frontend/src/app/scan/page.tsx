"use client";

import Camera, { CameraHandle } from "@/components/Camera";
import { useRef, useState, useEffect } from "react";
import jsQR from "jsqr";
import SuccessPopup from "@/components/SuccessPopup";
import ErrorPopup from "@/components/ErrorPopup";
import AttachFileButton from "@/components/AttachFileButton";
import CameraToggleButton from "@/components/CameraToggleButton";
import logo from "../../../public/jobfair_logo.png";

const SQUARE_SIZE = 256;

const Scan: React.FC = () => {
  const cameraRef = useRef<CameraHandle | null>(null);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showMessage, setShowMessage] = useState("");
  const [isCameraOn, setIsCameraOn] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    const detectQRCode = async () => {
      const videoElement = cameraRef.current?.getVideoElement();
      if (videoElement) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          console.error("Could not get canvas context");
          return;
        }

        // Calculate the center position of the cropped area
        const centerX = (dimensions.width - SQUARE_SIZE) / 2;
        const centerY = (dimensions.height - SQUARE_SIZE) / 2;

        // Calculate scaling factors
        const scaleX = videoElement.videoWidth / videoElement.offsetWidth;
        const scaleY = videoElement.videoHeight / videoElement.offsetHeight;

        // Set canvas size to the cropped area
        canvas.width = SQUARE_SIZE;
        canvas.height = SQUARE_SIZE;

        // Calculate the source position and size
        const sourceX = centerX * scaleX;
        const sourceY = centerY * scaleY;
        const sourceSize = SQUARE_SIZE * Math.max(scaleX, scaleY);

        // Draw the cropped area onto the canvas
        ctx.drawImage(
          videoElement,
          sourceX,
          sourceY,
          sourceSize,
          sourceSize,
          0,
          0,
          SQUARE_SIZE,
          SQUARE_SIZE
        );

        const imageData = ctx.getImageData(0, 0, SQUARE_SIZE, SQUARE_SIZE);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          const croppedImageSrc = canvas.toDataURL("image/png");
          const blob = await fetch(croppedImageSrc).then((res) => res.blob());

          try {
            const formData = new FormData();
            formData.append("file", blob, "cropped-qrcode.png");

            const response = await fetch("https://backend-api.com/upload", {
              method: "POST",
              body: formData,
            });

            if (response.ok) {
              setShowSuccessPopup(true);
            } else {
              const errorData = await response.json();
              setShowMessage(`Error: ${errorData.message}`);
              setShowErrorPopup(true);
            }
          } catch (error) {
            setShowMessage("Failed to upload cropped image");
            setShowErrorPopup(true);
          }
        }
      }
    };

    const interval = setInterval(detectQRCode, 500);
    return () => clearInterval(interval);
  }, [dimensions]);

  useEffect(() => {
    let lastTap = 0;
  
    const handleDoubleClickOrTap = (event: MouseEvent | TouchEvent) => {
      if ((event.target as HTMLElement)?.closest("button")) {
        return;
      }
    
      if (event.type === "dblclick") {
        handleSwitchCamera();
      } else if (event.type === "touchstart") {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
    
        if (tapLength < 300 && tapLength > 0) {
          handleSwitchCamera();
        }
    
        lastTap = currentTime;
      }
    };    
  
    document.addEventListener("dblclick", handleDoubleClickOrTap);
    document.addEventListener("touchstart", handleDoubleClickOrTap);
  
    return () => {
      document.removeEventListener("dblclick", handleDoubleClickOrTap);
      document.removeEventListener("touchstart", handleDoubleClickOrTap);
    };
  }, []);
  

  const handleFileChange = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await fetch("https://backend-api.com/upload", {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
        setShowSuccessPopup(true);
      } else {
        const errorData = await response.json();
        setShowMessage(`Error: ${errorData.message}`);
        setShowErrorPopup(true);
      }
    } catch (error) {
      setShowMessage("Failed to upload file");
      setShowErrorPopup(true);
    }
  };

  const handleSwitchCamera = () => {
    if (cameraRef.current) {
      cameraRef.current.switchCamera();
    }
  };

  const toggleCamera = () => {
    setIsCameraOn((prev) => {
      if (prev && cameraRef.current) {
        const videoElement = cameraRef.current.getVideoElement();
        if (videoElement) {
          const stream = videoElement.srcObject as MediaStream;
          stream?.getTracks().forEach(track => track.stop());
        }
      }
      return !prev;
    });
  };
  

  // Calculate center position for the overlay
  const centerX = Math.max(0, (dimensions.width - SQUARE_SIZE) / 2);
  const centerY = Math.max(0, (dimensions.height - SQUARE_SIZE) / 2);

  return (
    <div ref={containerRef} className="relative h-screen w-screen overflow-hidden bg-discord">
      {/* Camera */}
      <div className="absolute inset-0">
        {isCameraOn && <Camera ref={cameraRef} />}
      </div>

      {/* Logo */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50">
        <img src={logo.src} alt="Logo" className="w-36" />
      </div>

      {/* Top text */}
      <div className="absolute top-32 left-1/2 transform -translate-x-1/2 z-50">
        <p className="text-white text-xl">KU Tech จำกัด</p>
      </div>

      {/* Overlay */}
      <div
        className="absolute"
        style={{
          left: `${centerX}px`,
          top: `${centerY}px`,
          width: `${SQUARE_SIZE}px`,
          height: `${SQUARE_SIZE}px`,
          border: "2px solid white",
          boxShadow: "0 0 0 10000px rgba(0, 0, 0, 0.4)",
          zIndex: 40,
        }}
      >
        {/* Corner markers */}
        <div className="absolute top-0 left-0">
          <div className="absolute border-l-4 border-white h-5" style={{ left: -4, top: -4 }} />
          <div className="absolute border-t-4 border-white w-5" style={{ left: -4, top: -4 }} />
        </div>
        <div className="absolute top-0 right-0">
          <div className="absolute border-r-4 border-white h-5" style={{ right: -4, top: -4 }} />
          <div className="absolute border-t-4 border-white w-5" style={{ right: -4, top: -4 }} />
        </div>
        <div className="absolute bottom-0 left-0">
          <div className="absolute border-l-4 border-white h-5" style={{ left: -4, bottom: -4 }} />
          <div className="absolute border-b-4 border-white w-5" style={{ left: -4, bottom: -4 }} />
        </div>
        <div className="absolute bottom-0 right-0">
          <div className="absolute border-r-4 border-white h-5" style={{ right: -4, bottom: -4 }} />
          <div className="absolute border-b-4 border-white w-5" style={{ right: -4, bottom: -4 }} />
        </div>
      </div>

      {/* Control buttons */}
      <div className="absolute bottom-8 left-1/4 transform -translate-x-1/2 -translate-y-1/3 z-[9999] flex items-center gap-4">
        <AttachFileButton onFileChange={handleFileChange} />
      </div>
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-[9999] flex items-center gap-4">
      </div>
      <div className="absolute bottom-8 left-3/4 transform -translate-x-1/2 -translate-y-1/3 z-[9999] flex items-center gap-4">  
        <CameraToggleButton isCameraOn={isCameraOn} onToggle={toggleCamera} />
      </div>

      {/* Success Popup */}
      <SuccessPopup
        isOpen={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
      />

      {/* Error Popup */}
      <ErrorPopup
        message={showMessage}
        isOpen={showErrorPopup}
        onClose={() => setShowErrorPopup(false)}
      />
    </div>
  );
};

export default Scan;