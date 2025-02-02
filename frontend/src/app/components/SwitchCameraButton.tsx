import React from "react";
import { RefreshCcw } from "lucide-react";

interface SwitchCameraButtonProps {
  onClick: () => void;
}

const SwitchCameraButton: React.FC<SwitchCameraButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="p-3 bg-white text-black rounded-full shadow-lg hover:bg-gray-200 transition-colors duration-200"
    >
      <RefreshCcw className="w-6 h-6" />
    </button>
  );
};

export default SwitchCameraButton;
