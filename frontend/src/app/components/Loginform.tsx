import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

const LoginForm: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      if (response.ok) {
        router.push("/scan");
      } else {
        const errorData = await response.json();
        console.error("Login failed:", errorData);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-discord rounded-lg p-6">
      <h1 className="text-base text-center text-gray-800 dark:text-white">{t("login")}</h1>
      <form className="mt-6" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-[#334151] dark:text-[#CCCFD3]">
            {t("username")}
          </label>
          <input
            type="text"
            id="username"
            value={username}
            placeholder={t("exusername")}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg dark:bg-discord dark:text-white focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-[#334151] dark:text-[#CCCFD3]">
            {t("password")}
          </label>
          <input
            type="password"
            id="password"
            value={password}
            placeholder={t("expassword")}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 dark:bg-discord dark:text-white border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className={`px-4 py-2 rounded text-white ${
              username && password ? "bg-[#02BC77] hover:bg-[#07B474]" : "bg-gray-300 cursor-not-allowed"
            }`}
            disabled={!username || !password}
          >
            {t("button")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
