"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Loading from "@/components/Loading";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import LoginForm from "@/components/Loginform";
import { ChevronRight } from 'lucide-react';
import white_logo from "../../public/white_logo.png";
import dark_logo from "../../public/dark_logo.png";


const useAuth = () => {
  const [user, setUser] = useState<string | null>(null);
  const [company, setCompany] = useState<string | null>(null);
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
          setCompany(userData.company);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error:", error);
        setUser(null);
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  return { user, company, loading, setUser };
};

export default function Home() {
  const { t } = useTranslation();
  const router = useRouter();
  const { theme } = useTheme();
  const { user, company, loading, setUser } = useAuth();
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
          <div className="flex flex-col items-center justify-center text-l dark:text-white">
            <p>{company}</p>
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
              {t("logoutbutton")}
            </button>
            <button
              onClick={() => {
                router.push("/scan");
              }}
              className="mt-16 p-2 bg-[#02BC77] hover:bg-[#07B474] text-white rounded"
            >
              <ChevronRight />
            </button>
          </div>
        ) : (
          <LoginForm />
        )}
      </div>
    </div>
  );
}
