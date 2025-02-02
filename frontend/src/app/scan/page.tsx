"use client";

import Camera, { CameraHandle } from "@/components/Camera";
import PhotoButton from "@/components/PhotoButton";
import AttachFileButton from "@/components/AttachFileButton";
import SwitchCameraButton from "@/components/SwitchCameraButton";
import { useRef, useState, useEffect } from "react";

const SQUARE_SIZE = 128;

const Scan: React.FC = () => {
  const cameraRef = useRef<CameraHandle | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setIsClient(true);
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
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
      } else {
        console.error("Failed to capture image");
      }
    } else {
      console.error("Camera ref is null");
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
  const centerX = (dimensions.width - SQUARE_SIZE) / 2;
  const centerY = (dimensions.height - SQUARE_SIZE) / 2;

  return (
    <div className="relative h-screen w-screen">
      <div className="w-full h-full">
        <Camera ref={cameraRef} />
      </div>

      {/* Overlays */}
      <div 
        className="absolute top-0 left-0 right-0 bg-black/50"
        style={{ height: `${centerY}px` }}
      />
      <div 
        className="absolute bottom-0 left-0 right-0 bg-black/50"
        style={{ height: `${centerY}px` }}
      />
      <div 
        className="absolute bg-black/50"
        style={{
          top: `${centerY}px`,
          left: 0,
          width: `${centerX}px`,
          height: `${SQUARE_SIZE}px`
        }}
      />
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
      <div className="absolute" style={{ left: `${centerX}px`, top: `${centerY}px`, width: `${SQUARE_SIZE}px`, height: `${SQUARE_SIZE}px` }}>
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
          <div className="absolute border-b-2 border-white w-5" style={{ bottom: 0, right: 0 }} />
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
    </div>
  );
};

export default Scan;