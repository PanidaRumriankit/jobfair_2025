import type React from "react"
import { useTranslation } from 'react-i18next';
import "../../../i18n";

const Loading: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white dark:bg-black rounded-lg p-8 flex flex-col items-center space-y-4 border border-gray-300 dark:border-gray-700">
          <div className="w-12 h-12 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-black dark:text-white">{t('loading')}</p>
        </div>
      </div>
    </div>
  )
}

export default Loading

