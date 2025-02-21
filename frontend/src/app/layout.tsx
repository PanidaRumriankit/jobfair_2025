"use client";

import { Noto_Sans_Thai } from 'next/font/google';
import { ThemeProvider } from "next-themes";
// import { SessionProvider } from 'next-auth/react';
import "./globals.css";

const notoSansThai = Noto_Sans_Thai({ subsets: ['thai', 'latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="th">
      <body
        className={`${notoSansThai.className} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange={true}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
