import { UserType } from "@/types/employee";
import { api } from "@/utils/fetch";

import { useCallback, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Context } from "@/store/UserContext";

export const useUser = () => {
  const { user, setUser } = useContext(Context) as any;

  const setUserCb = useCallback((val: UserType) => setUser(val), [setUser]);

  const router = useRouter();
  const getMe = useCallback(async () => {
    try {
      const { data } = await api.get("/user/me");
      setUserCb(data?.data);
    } catch (e) {
      console.log(e);
      router.push("/login");
    }
  }, [router, setUserCb]);

  useEffect(() => {
    if (!user) {
      getMe();
    }
  }, [user, getMe]);
  return { user, setUser };
};
