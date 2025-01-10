import React from "react";

const Loading: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
      <div className="loader">Loading...</div>
    </div>
  );
};

export default Loading;