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

const useAuth = () => {
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("http://localhost:3000/users/profile", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData.username);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  return { user, loading, setUser };
};

export default function Home() {
  const { theme } = useTheme();
  const { user, loading, setUser } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || loading) return <Loading />;

  return (
    <div className="min-h-screen flex flex-col justify-center bg-white dark:bg-discord">
      <div className="flex justify-end gap-4 mr-12 mb-8">
        <ThemeSwitcher />
        <LanguageSwitcher />
      </div>
      <div className="flex flex-col items-center justify-center gap-8">
        <Image src={theme === "dark" ? dark_logo : white_logo} alt="KU Job Fair logo" width="228" height="159" />
        {user ? (
          <div className="text-l dark:text-white">
            <p>{user}</p>
            <button
              onClick={async () => {
                await fetch("http://localhost:3000/auth/logout", {
                  method: "POST",
                  credentials: "include",
                });
                setUser(null);
              }}
              className="mt-4 p-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <LoginForm />
        )}
      </div>
    </div>
  );
}
