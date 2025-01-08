// components/loginForm.tsx
"use client";
import React, { useState, useEffect } from "react";

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    setUsername("");
    setPassword("");
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log({ email: username, password });
  };

  const isFormValid = () => {
    return username.length > 0 && password.length > 0;
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
      <h1 className="text-base text-center text-gray-800">เข้าใช้งานระบบสแกน QR Code</h1>
      <form className="mt-6" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-[#334151]">
            ชื่อบัญชีผู้ใช้งาน
          </label>
          <input
            type="username"
            id="username"
            value={username}
            placeholder="เช่น wtxqn, jtwed"
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-[#334151]">
            รหัสผ่าน
          </label>
          <input
            type="password"
            id="password"
            value={password}
            placeholder="รหัสผ่านผู้ใช้งาน"
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="flex justify-center">
            <button
            type="submit"
            className={`px-4 py-2 rounded text-white ${
              isFormValid() ? 'bg-[#02BC77] hover:bg-[#07B474]' : 'bg-gray-300 cursor-not-allowed'
            }`}
            disabled={!isFormValid()}
            onClick={(e) => {
              if (isFormValid()) {
              e.currentTarget.style.backgroundColor = '#047D50';
              }
            }}
            >
            เข้าสู่ระบบ
            </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;