"use client";

import Camera, { CameraHandle } from "@/components/Camera";
import PhotoButton from "@/components/PhotoButton";
import AttachFileButton from "@/components/AttachFileButton";
import SwitchCameraButton from "@/components/SwitchCameraButton";
import SuccessPopup from "@/components/SuccessPopup";
import SessionTimeout from "@/components/SessionTimeout";
import ErrorPopup from "@/components/ErrorPopup";
import logo from "../../../public/jobfair_logo.png";
import { useRef, useState, useEffect } from "react";

const SQUARE_SIZE = 256;

const Scan: React.FC = () => {
  const cameraRef = useRef<CameraHandle | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showMessage, setShowMessage] = useState("");
  const [showSessionTimeout, setShowSessionTimeout] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const cropImageToSquare = (imageSrc: string): Promise<string> => {
    return new Promise((resolve) => {
      const image = new Image();
      image.src = imageSrc;

      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          console.error("Could not get canvas context");
          return;
        }

        const centerX = (dimensions.width - SQUARE_SIZE) / 2;
        const centerY = (dimensions.height - SQUARE_SIZE) / 2;

        const videoElement = document.querySelector('video');
        if (!videoElement) {
          console.error("Video element not found");
          return;
        }

        const scaleX = image.width / videoElement.offsetWidth;
        const scaleY = image.height / videoElement.offsetHeight;

        canvas.width = SQUARE_SIZE;
        canvas.height = SQUARE_SIZE;

        const sourceX = centerX * scaleX;
        const sourceY = centerY * scaleY;
        const sourceSize = SQUARE_SIZE * Math.max(scaleX, scaleY);

        ctx.drawImage(
          image,
          sourceX,
          sourceY,
          sourceSize,
          sourceSize,
          0,
          0,
          SQUARE_SIZE,
          SQUARE_SIZE
        );

        const croppedImageSrc = canvas.toDataURL("image/png");
        resolve(croppedImageSrc);
      };
    });
  };

  const handleTakePicture = async () => {
    if (cameraRef.current) {
      const imageSrc = cameraRef.current.capture();
      if (imageSrc) {
        const croppedImage = await cropImageToSquare(imageSrc);
        console.log("Cropped image:", croppedImage);
  
        // Convert base64 to Blob
        const blob = await fetch(croppedImage).then((res) => res.blob());
  
        // Create a FormData object
        const formData = new FormData();
        formData.append("file", blob, "image.png");
  
        try {
          const response = await fetch("https://backend-api.com/upload", {
            method: "POST",
            body: formData,
          });
  
          if (response.ok) {
            setShowSuccessPopup(true);
          } else {
            setShowErrorPopup(true);
            const errorData = await response.json();
            setShowMessage("Image upload failed: " + errorData.message);
            console.error("Image upload failed:", errorData);
          }
        } catch (error) {
          setShowErrorPopup(true);
          setShowMessage("Error uploading image");
        }
      } else {
        setShowErrorPopup(true);
        setShowMessage("Failed to capture image");
      }
    } else {
      setShowErrorPopup(true);
      setShowMessage("Camera ref is null");
    }
  };


  const handleFileChange = (file: File) => {
    console.log("Selected file:", file);
  };

  const handleSwitchCamera = () => {
    if (cameraRef.current) {
      cameraRef.current.switchCamera();
    }
  };

  if (!isClient) {
    return null;
  }

  // Calculate center position
  const centerX = Math.max(0, (dimensions.width - SQUARE_SIZE) / 2);
  const centerY = Math.max(0, (dimensions.height - SQUARE_SIZE) / 2);

  return (
    <div ref={containerRef} className="relative h-screen w-screen overflow-hidden bg-discord">
      {/* Camera */}
      <div className="absolute inset-0">
        <Camera ref={cameraRef} />
      </div>

      {/* Logo */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-50">
        <img src={logo.src} alt="Logo" className="w-36" />
      </div>

      {/* Top text */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50">
        <p className="text-white text-xl">KU Tech จำกัด</p>
      </div>

      {/* Top overlay */}
      <div 
        className="absolute top-0 left-0 right-0 bg-black/50"
        style={{ height: `${centerY}px` }}
      />

      {/* Bottom overlay */}
      <div 
        className="absolute bottom-0 left-0 right-0 bg-black/50"
        style={{ height: `${centerY}px` }}
      />

      {/* Left overlay */}
      <div 
        className="absolute bg-black/50"
        style={{
          top: `${centerY}px`,
          left: 0,
          width: `${centerX}px`,
          height: `${SQUARE_SIZE}px`
        }}
      />

      {/* Right overlay */}
      <div 
        className="absolute bg-black/50"
        style={{
          top: `${centerY}px`,
          right: 0,
          width: `${centerX}px`,
          height: `${SQUARE_SIZE}px`
        }}
      />

      {/* Corner markers */}
      <div 
        className="absolute"
        style={{
          left: `${centerX}px`,
          top: `${centerY}px`,
          width: `${SQUARE_SIZE}px`,
          height: `${SQUARE_SIZE}px`,
          zIndex: 40
        }}
      >
        {/* Top-left corner */}
        <div className="absolute top-0 left-0">
          <div className="absolute border-l-2 border-white h-5" />
          <div className="absolute border-t-2 border-white w-5" />
        </div>
        
        {/* Top-right corner */}
        <div className="absolute top-0 right-0">
          <div className="absolute border-r-2 border-white h-5" />
          <div className="absolute border-t-2 border-white w-5" style={{ right: 0 }} />
        </div>
        
        {/* Bottom-left corner */}
        <div className="absolute bottom-0 left-0">
          <div className="absolute border-l-2 border-white h-5" style={{ bottom: 0 }} />
          <div className="absolute border-b-2 border-white w-5" />
        </div>
        
        {/* Bottom-right corner */}
        <div className="absolute bottom-0 right-0">
          <div className="absolute border-r-2 border-white h-5" style={{ bottom: 0 }} />
          <div className="absolute border-b-2 border-white w-5" style={{ right: 0 }} />
        </div>
      </div>

      {/* Control buttons */}
      <div className="absolute bottom-8 left-1/4 transform -translate-x-1/2 -translate-y-1/3 z-[9999] flex items-center gap-4">
        <AttachFileButton onFileChange={handleFileChange} />
      </div>
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-[9999] flex items-center gap-4">
        <PhotoButton onClick={handleTakePicture} />
      </div>
      <div className="absolute bottom-8 left-3/4 transform -translate-x-1/2 -translate-y-1/3 z-[9999] flex items-center gap-4">
        <SwitchCameraButton onClick={handleSwitchCamera} />
      </div>

      {/* Success popup */}
      <SuccessPopup
        isOpen={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
      />
      
      {/* Error popup */}
      <ErrorPopup
        message={showMessage}
        isOpen={showErrorPopup}
        onClose={() => setShowErrorPopup(false)}
      />

      {/* Session timeout */}
      <SessionTimeout
        isOpen={showSessionTimeout}
        onClose={() => setShowSessionTimeout(false)}
      />
    </div>
  );
};

export default Scan;