import React from "react";
import LoginForm from "./components/LoginForm";
import white_logo from "../../public/white_logo.png";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black">
      <Image src={white_logo} alt="KU Job Fair logo" width="228" height="159" />
      <LoginForm />
    </div>
  );
}
