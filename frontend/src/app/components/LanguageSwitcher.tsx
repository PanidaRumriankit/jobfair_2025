'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setCurrentLanguage(lang);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 text-sm font-medium text-gray-600 dark:text-gray-300">
      <button
        onClick={() => changeLanguage('th')}
        className={`hover:text-black dark:hover:text-white ${
          currentLanguage === 'th' ? 'text-black dark:text-white font-bold' : ''
        }`}
      >
        TH
      </button>
      <span className="text-gray-400">|</span>
      <button
        onClick={() => changeLanguage('en')}
        className={`hover:text-black dark:hover:text-white ${
          currentLanguage === 'en' ? 'text-black dark:text-white font-bold' : ''
        }`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
