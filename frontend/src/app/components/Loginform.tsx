// components/loginForm.tsx
"use client";
import React, { useState } from "react";

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayPassword, setDisplayPassword] = useState(''); // Used to display the visible password temporarily
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (newPassword.length < password.length) {
      setPassword((prev) => prev.slice(0, -1));
      setDisplayPassword((prev) => prev.slice(0, -1));

    } else {
      setPassword((prev) => prev + newPassword.slice(-1));

      if (newPassword.length === 1) {
        setDisplayPassword((prev) => prev.slice(0, -1) + newPassword.slice(-1));
      } else {
        setDisplayPassword((prev) => prev.slice(0, -1) + '•' + newPassword.slice(-1));
      }

      const id = setTimeout(() => {
        setDisplayPassword((prev) => prev.slice(0, -1) + '•');
      }, 500);

      setTimeoutId(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log({ email: username, password });
  };

  const isFormValid = () => {
    return username.length > 0 && password.length > 0;
  };

  // console.log(password);

  return (
    <div className="w-full max-w-md bg-white dark:bg-black rounded-lg p-6">
      <h1 className="text-base text-center text-gray-800 dark:text-white">เข้าใช้งานระบบสแกน QR Code</h1>
      <form className="mt-6" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-[#334151] dark:text-[#CCCFD3]">
            ชื่อบัญชีผู้ใช้งาน
          </label>
          <input
            type="username"
            id="username"
            value={username}
            placeholder="เช่น wtxqn, jtwed"
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg dark:text-white focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-[#334151] dark:text-[#CCCFD3]">
            รหัสผ่าน
          </label>
          <input
            type="text"
            id="password"
            value={displayPassword}
            placeholder="รหัสผ่านผู้ใช้งาน"
            onChange={handlePasswordChange}
            required
            className="w-full px-3 py-2 dark:text-white border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className={`px-4 py-2 rounded text-white ${
              isFormValid() ? 'bg-[#02BC77] hover:bg-[#07B474]' : 'bg-gray-300 cursor-not-allowed'
            }`}
            disabled={!isFormValid()}
          >
            เข้าสู่ระบบ
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;