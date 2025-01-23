import type React from "react"

const Loading: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white dark:bg-black rounded-lg p-8 flex flex-col items-center space-y-4 border border-gray-300 dark:border-gray-700">
          <div className="w-12 h-12 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-black dark:text-white">Loading...</p>
        </div>
      </div>
    </div>
  )
}

export default Loading

