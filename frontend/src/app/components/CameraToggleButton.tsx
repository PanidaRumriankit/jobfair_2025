"use client";

import { useState } from "react";
import { Camera, CameraOff } from "lucide-react";

interface CameraToggleButtonProps {
  isCameraOn: boolean;
  onToggle: () => void;
}

const CameraToggleButton: React.FC<CameraToggleButtonProps> = ({ isCameraOn, onToggle }) => {
  const [isPressed, setIsPressed] = useState(false);
  const handlePress = () => setIsPressed(true);
  const handleRelease = () => setIsPressed(false);

  return (
    <button
      onClick={onToggle}
      onTouchStart={handlePress}
      onTouchEnd={handleRelease}
      onMouseDown={handlePress}
      onMouseUp={handleRelease}
      onMouseLeave={handleRelease}
      className={`p-3 bg-white text-black rounded-full shadow-lg hover:bg-gray-200 transition-colors ${
        isPressed ? "bg-gray-200" : "bg-white"
      }`}
    >
      {isCameraOn ? <CameraOff className="w-8 h-8 text-gray-700" /> : <Camera className="w-8 h-8" />}
    </button>
  );
};

export default CameraToggleButton;
