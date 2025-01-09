"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Brightness3Icon from '@mui/icons-material/Brightness3';
import LightModeIcon from '@mui/icons-material/LightMode';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(true);

  if (!mounted) return null;

  return (
    <div className="flex justify-space-between gap-0.5 items-center">
      <LightModeIcon className="mr-2 dark:text-white" />
      <button
        className={`relative w-12 h-6 rounded-full ${
          theme === 'dark' ? 'bg-black' : 'bg-green-500'
        } transition`}
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        <span
          className={`absolute w-4 h-4 bg-white rounded-full top-1 left-1 transition-transform ${
            theme === 'dark' ? 'translate-x-6' : ''
          }`}
        />
      </button>
      <Brightness3Icon className="dark:text-white"/>
    </div>
  );
};