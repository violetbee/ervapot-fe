"use client";

import { menu } from "@/settings/constants/menu";
import { UserType } from "@/types/employee";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { HiOutlineChevronDoubleLeft } from "react-icons/hi2";

export const SideBar = ({ user }: any) => {
  const currentPath = usePathname();
  const bannerRef = useRef<HTMLDivElement>(null);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (bannerRef.current) {
      bannerRef.current.scrollTo({
        left: currentImage * 300,
        behavior: "smooth",
      });
    }
  }, [currentImage]);

  useEffect(() => {
    const bannerIntervalId = setInterval(() => {
      setCurrentImage((prev) => (prev === 2 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(bannerIntervalId);
  }, []);
  return (
    <>
      <input
        id="sidebar"
        type="checkbox"
        className="hidden peer"
        value="selected"
      />
      <label
        htmlFor="sidebar"
        className="peer-checked:[&>svg]:rotate-180 fixed md:absolute top-4 -left-6 z-[999] translate-x-[100%] w-6 h-8 rounded-r-lg bg-indigo-400 cursor-pointer flex items-center justify-center shrink-0 select-none"
      >
        <HiOutlineChevronDoubleLeft className="duration-200 text-white" />
      </label>
      <aside className="fixed h-full w-full peer-checked:translate-x-0 -translate-x-[110%] md:-translate-x-0 md:w-auto duration-200 [&>nav]:-translate-x-[110%] peer-checked:[&>nav]:translate-x-0 md:[&>nav]:translate-x-0 md:relative left-0 z-[998] top-0 md:flex items-start justify-start md:peer-checked:[&>nav]:-ml-48 md:peer-checked:-ml-60 bg-white md:bg-transparent md:p-4 md:pr-1">
        <nav className="md:sticky md:top-0 p-4 rounded-md duration-200 space-y-5 text-[#586083] w-full bg-transparent md:bg-white">
          <Image
            src="/images/ervapot-logo.png"
            width={300}
            height={200}
            alt="logo"
            className="w-96 h-full p-2"
          />
          <ul className="flex flex-col overflow-hidden content-center justify-between gap-2">
            {menu
              .filter((item) => {
                if (item.permission.includes((user as UserType)?.role)) {
                  return true;
                }
                return false;
              })
              .map((item) => (
                <Link
                  key={item.id}
                  className={`py-2 px-3 hover:bg-indigo-400 hover:text-white rounded flex items-center gap-3 ${
                    currentPath === item.url &&
                    "bg-indigo-400 text-white font-medium"
                  }`}
                  href={item.url}
                >
                  <item.icon />
                  <span className="pt-[1px]">{item.name}</span>
                </Link>
              ))}
          </ul>
          <div className="bg-gray-50 rounded-md border w-full p-1 space-y-1 select-none">
            <h2 className="text-center font-semibold">Duyurular</h2>
            <div
              ref={bannerRef}
              className="w-full flex overflow-x-hidden h-full rounded-md gap-4 snap-x snap-mandatory text-white"
            >
              <div className="w-full bg-red-400 h-48 shrink-0 snap-center flex items-center justify-center">
                1
              </div>
              <div className="w-full bg-purple-600 h-48 shrink-0 snap-center flex items-center justify-center">
                2
              </div>
              <div className="w-full bg-green-600 h-48 shrink-0 snap-center flex items-center justify-center">
                3
              </div>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
};
