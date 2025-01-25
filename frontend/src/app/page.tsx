"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import LoginForm from "@/components/LoginForm";
import Loading from "@/components/Loading";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import LanguageSwitcher from "./components/LanguageSwitcher";
import white_logo from "../../public/white_logo.png";
import dark_logo from "../../public/dark_logo.png";
import '../../i18n';

export default function Home() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <Loading />;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black">
      <div className="flex justify-end gap-4 mb-12 ml-96">
        <ThemeSwitcher />
        <LanguageSwitcher />
      </div>
      <div className="flex flex-col items-center justify-center gap-8">
        <Image src={theme === "dark" ? dark_logo : white_logo} alt="KU Job Fair logo" width="228" height="159" />
        <LoginForm />
      </div>
    </div>
  );
}
