import { Image } from "lucide-react";
import React from "react";

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

  return (
    <>
      {/* Attach file button */}
      <button
        onClick={handleClick}
        className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-200 transition-colors duration-200"
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