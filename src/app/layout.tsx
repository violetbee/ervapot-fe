"use client";

// import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import type { ReactNode } from "react";
import ToastProvider from "@/components/toast-provider";
import { UserContext } from "@/store/UserContext";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

// export const metadata: Metadata = {
//   title: "Erva Pot CRM",
//   description: "Erva Pot Çalışan Yönetim Sistemi",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.className} antialiased flex flex-col md:h-screen md:overflow-hidden bg-[#EDEDEE]`}
      >
        <UserContext>
          <ToastProvider>{children}</ToastProvider>
        </UserContext>
        <footer className="mt-auto mx-auto text-sm opacity-50 mb-2">
          Ervapot
        </footer>
      </body>
    </html>
  );
}
