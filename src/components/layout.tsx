"use client";

import { useEffect } from "react";
import { Header } from "./header";
import { SideBar } from "./side-bar";
import { useUser } from "@/hooks/useUser";
import { usePathname, useRouter } from "next/navigation";
import { UserRole } from "@/types/employee";

export const Layout = ({
  children,
  title,
  ActionButton,
}: {
  children: React.ReactNode;
  title?: string;
  ActionButton?: React.ReactNode;
}) => {
  const { user } = useUser();

  const currentPath = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (currentPath === "/") return;
    if (
      user &&
      user?.role !== ("ADMIN" as UserRole) &&
      currentPath !== "/stok-merkezi"
    ) {
      router.push("/");
    }
  }, [user, currentPath, router]);

  return (
    <div className="flex flex-col sm:flex-row md:overflow-hidden">
      <SideBar user={user} />
      <div
        role="main"
        className="w-full h-full flex-grow overflow-auto space-y-8 md:p-4 px-2 py-4"
      >
        <Header user={user!} />
        <main
          className={`bg-white rounded-md p-4 flex flex-col ${
            title && "divide-y"
          }`}
        >
          {(title || ActionButton) && (
            <div className="flex justify-between items-center py-2">
              <h1 className="font-medium text-2xl">{title}</h1>
              {ActionButton && ActionButton}
            </div>
          )}
          <div className="pt-5">{children}</div>
        </main>
      </div>
    </div>
  );
};
