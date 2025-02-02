import React, { useState } from "react";

interface PhotoButtonProps {
  onClick: () => void;
  className?: string;
}

const PhotoButton: React.FC<PhotoButtonProps> = ({ onClick }) => {
  const [isPressed, setIsPressed] = useState(false);

  // Handle button press (mouse down or touch start)
  const handlePress = () => {
    setIsPressed(true); // Shrink the button
  };

  // Handle button release (mouse up or touch end)
  const handleRelease = () => {
    setIsPressed(false); // Return to original size
    onClick(); // Call the provided onClick function
  };

  return (
    <button
      onMouseDown={handlePress} // For desktop
      onMouseUp={handleRelease} // For desktop
      onMouseLeave={handleRelease} // Reset if mouse leaves while pressed
      onTouchStart={handlePress} // For mobile
      onTouchEnd={handleRelease} // For mobile
      className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-200 transition-transform duration-100 border-4 border-white ${
        isPressed ? "scale-90" : "scale-100"
      }`}
      style={{
        backgroundColor: "transparent",
        padding: "4px",
      }}
    >
      {/* Inner circle */}
      <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
      </div>
    </button>
  );
};

export default PhotoButton;