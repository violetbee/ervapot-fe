"use client";

import { useUser } from "@/hooks/useUser";
import { UserType } from "@/types/employee";
import axios from "axios";
import { GoSearch } from "react-icons/go";
import { IoIosLogOut } from "react-icons/io";

export const Header = ({ user }: { user: UserType }) => {
  const { logout } = useUser();
  return (
    <header className="p-4 bg-white rounded-md flex justify-between">
      <div className="flex min-w-0 items-center">
        <GoSearch size="18" className="opacity-40" />
        <input
          className="border-0 focus:outline-none px-2 !min-w-0"
          type="text"
          placeholder="Bir şeyler ara.."
        />
      </div>
      <div className="flex items-center shrink-0 gap-4">
        <div className="flex flex-col items-end">
          <p className="font-medium text-sm">
            {user?.name + " " + user?.surname}
          </p>
          <p className="text-xs">{user?.phoneNumber}</p>
        </div>

        <IoIosLogOut
          onClick={async (e) => {
            e.preventDefault();
            await axios.post(
              `${process.env.NEXT_PUBLIC_BASE_URL}/auth/logout`,
              undefined
            );
            logout();
          }}
          size={24}
          className="shrink-0 text-gray-400 cursor-pointer"
        />
      </div>
    </header>
  );
};
