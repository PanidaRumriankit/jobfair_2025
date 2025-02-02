"use client";

import { Inter } from 'next/font/google';
import { ThemeProvider } from "next-themes"
import "./globals.css";

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange={true}
        >
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
