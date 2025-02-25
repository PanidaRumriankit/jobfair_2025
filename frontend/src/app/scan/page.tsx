"use client";

import Camera, { CameraHandle } from "@/components/Camera";
import { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from 'lucide-react';
import jsQR from "jsqr";
import SuccessPopup from "@/components/SuccessPopup";
import ErrorPopup from "@/components/ErrorPopup";
import AttachFileButton from "@/components/AttachFileButton";
import CameraToggleButton from "@/components/CameraToggleButton";
import Loading from "@/components/Loading";
import logo from "../../../public/jobfair_logo.png";

const SQUARE_SIZE = 256;

const Scan: React.FC = () => {
  // const { data: session, status } = useSession();
  const router = useRouter();
  const cameraRef = useRef<CameraHandle | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showMessage, setShowMessage] = useState("");
  const [ssid, setSsid] = useState<string | undefined>(undefined);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [user, setUser] = useState({
    company: "",
    username: "",
  });

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("http://localhost:3000/users/profile", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error("Error:", error);
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  useEffect(() => {
    setMounted(true);

    const updateDimensions = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
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
        const centerY = (videoElement.videoHeight - SQUARE_SIZE) / 2;

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

        // console.log("ImageData:", imageData);

        const code = jsQR(imageData.data, imageData.width, imageData.height);

        // console.log("QR Code Result:", code ? code.data : "No QR detected");

        if (code && code.data) {
          // console.log("QR Code Data:", code.data);
          try {
            const formData = {
              studentId: code.data,
            };
        
            const response = await fetch("http://localhost:3000/users/send", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formData),
              credentials: "include",
            });
        
            if (response.ok) {
              setShowSuccessPopup(true);
              setSsid(code.data);
            } else {
              const errorData = await response.json();
              setShowMessage(`Error: ${errorData.message}`);
              setShowErrorPopup(true);
            }
          } catch (error) {
            console.error("Failed to upload QR data:", error);
            setShowMessage("Failed to upload cropped image");
            setShowErrorPopup(true);
          }
        } else {
          console.log("No QR code detected.");
        }        
      }
    };

    const interval = setInterval(detectQRCode, 500);
    return () => clearInterval(interval);
  }, [dimensions]);

  const handleSwitchCamera = useCallback(() => {
    if (cameraRef.current) {
      cameraRef.current.switchCamera();
    }
  }, []);
  

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
  }, [handleSwitchCamera]);
  
  if (!mounted || loading) return <Loading />;

  const handleFileChange = async (file: File) => {
    const reader = new FileReader();
  
    reader.onload = async (event) => {
      const image = new Image();
      image.src = event.target?.result as string;
  
      image.onload = async () => {
        // Draw the image on a canvas
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) return;
  
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0, image.width, image.height);
  
        // Get image data from the canvas
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);
  
        if (code) {
          try {
            const formData = {
              studentId: code.data,
            };
  
            const response = await fetch("http://localhost:3000/users/send", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formData),
              credentials: "include",
            });
  
            if (response.ok) {
              setSsid(code.data);
              setShowSuccessPopup(true);
            } else {
              const errorData = await response.json();
              setShowMessage(`Error: ${errorData.message}`);
              setShowErrorPopup(true);
            }
          } catch (error) {
            console.error("Failed to upload QR data:", error);
            setShowMessage("Failed to upload QR data");
            setShowErrorPopup(true);
          }
        } else {
          setShowMessage("No QR code found in the image.");
          setShowErrorPopup(true);
        }
      };
    };
  
    reader.readAsDataURL(file);
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

      <button
        className="absolute top-8 left-8 z-50"
        onClick={() => router.push("/")}
      >
        <ChevronLeft size={32} color="white" />
      </button>

      {/* Logo */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50">
        <img src={logo.src} alt="Logo" className="w-36" />
      </div>

      {/* Top text */}
      <div className="absolute top-32 left-1/2 transform -translate-x-1/2 z-50">
        <p className="text-white text-xl">{user.company}</p>
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
        ssid={ssid}
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