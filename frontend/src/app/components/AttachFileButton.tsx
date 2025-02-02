import { Image } from "lucide-react";
import React, { useState } from "react";

interface AttachFileButtonProps {
  onFileChange: (file: File) => void;
}

const AttachFileButton: React.FC<AttachFileButtonProps> = ({ onFileChange }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileChange(file);
    }
  };

  const handleClick = () => {
    const fileInput = document.getElementById("file-input");
    if (fileInput) {
      fileInput.click();
    }
  };

  const [isPressed, setIsPressed] = useState(false);

  const handlePress = () => setIsPressed(true);
  const handleRelease = () => setIsPressed(false);

  return (
    <>
      {/* Attach file button */}
      <button
        onClick={handleClick}
        onTouchStart={handlePress}
        onTouchEnd={handleRelease}
        onMouseDown={handlePress}
        onMouseUp={handleRelease}
        onMouseLeave={handleRelease}
        className={`p-3 bg-white text-black rounded-full shadow-lg hover:bg-gray-200 transition-colors ${
          isPressed ? "bg-gray-200" : "bg-white"
        }`}
      >
        <Image className="w-6 h-6 text-gray-700" />
      </button>

      {/* Hidden file input */}
      <input
        id="file-input"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </>
  );
};

export default AttachFileButton;