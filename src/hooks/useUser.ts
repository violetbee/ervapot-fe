/* eslint-disable @typescript-eslint/no-unused-vars */
import { UserType } from "@/types/employee";
import { api } from "@/utils/fetch";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const useUser = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isInitialized, setIsInitialized] = useState(false); // SSR uyumluluğu için

  const router = useRouter();

  const filterSensitiveData = (user: UserType | null): UserType | null => {
    if (user && "password" in user) {
      const { password, ...filteredUser } = user;
      return filteredUser as UserType;
    }
    return user;
  };

  const setUserCb = useCallback((val: UserType | null) => {
    const filteredUser = filterSensitiveData(val);
    setUser(filteredUser);
    if (typeof window !== "undefined" && filteredUser) {
      localStorage.setItem("user", JSON.stringify(filteredUser));
    } else if (typeof window !== "undefined") {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  }, []);

  const getMe = useCallback(async () => {
    try {
      const { data } = await api.get("/user/me");
      setUserCb(data?.data);
    } catch (e) {
      console.error(e);
      setUserCb(null);
      router.push("/login");
    }
  }, [router, setUserCb]);

  const logout = () => {
    setUserCb(null);
    router.push("/login");
  };

  useEffect(() => {
    if (typeof window !== "undefined" && !isInitialized) {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setIsInitialized(true);
    }
  }, [isInitialized]);

  useEffect(() => {
    if (!user && isInitialized) {
      getMe();
    }
  }, [user, isInitialized, getMe]);

  return { user, setUser: setUserCb, logout };
};
