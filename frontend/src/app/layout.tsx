"use client";

import { Inter } from 'next/font/google';
import { ThemeProvider } from "next-themes";
import ThemeSwitcher from "./components/ThemeSwitcher";
import LanguageSwitcher from "./components/LanguageSwitcher";
import "./globals.css";

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <body className={`${inter.className} antialiased`}>
          <div className="flex justify-end gap-8 bg-white pt-[4.5rem] pr-16 dark:bg-black">
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
          <main className="-mt-24">{children}</main>
        </body>
      </ThemeProvider>
    </html>
  );
}
