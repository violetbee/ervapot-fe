import type { Metadata } from "next";
import "../globals.css";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Giriş - Erva Pot CRM",
  description: "Erva Pot Çalışan Yönetim Sistemi",
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-40px)] w-full">
      {children}
    </div>
  );
}
