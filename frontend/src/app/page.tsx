"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import LoginForm from "./components/LoginForm";
import Loading from "./components/Loading";
import white_logo from "../../public/white_logo.png";
import dark_logo from "../../public/dark_logo.png";
import Image from "next/image";

export default function Home() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <Loading />;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black">
      <Image src={theme === "dark" ? dark_logo : white_logo} alt="KU Job Fair logo" width="228" height="159" />
      <LoginForm />
    </div>
  );
}
