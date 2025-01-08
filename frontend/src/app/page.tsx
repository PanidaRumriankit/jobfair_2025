import React from "react";
import LoginForm from "./components/Loginform";
import white_logo from "../../public/white_logo.png";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Image src={white_logo} alt="white_logo" width="228" height="159" />
      <LoginForm />
    </div>
  );
}
