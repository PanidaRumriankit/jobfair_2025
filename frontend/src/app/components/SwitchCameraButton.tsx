import React, { useState } from "react";
import { RefreshCcw } from "lucide-react";

interface SwitchCameraButtonProps {
  onClick: () => void;
}

const SwitchCameraButton: React.FC<SwitchCameraButtonProps> = ({ onClick }) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = () => setIsPressed(true);
  const handleRelease = () => setIsPressed(false);

  return (
    <button
      onClick={onClick}
      onTouchStart={handlePress}
      onTouchEnd={handleRelease}
      onMouseDown={handlePress}
      onMouseUp={handleRelease}
      onMouseLeave={handleRelease}
      className={`p-3 bg-white text-black rounded-full shadow-lg hover:bg-gray-200 transition-colors ${
        isPressed ? "bg-gray-200" : "bg-white"
      }`}
    >
      <RefreshCcw className="w-6 h-6" />
    </button>
  );
};

export default SwitchCameraButton;