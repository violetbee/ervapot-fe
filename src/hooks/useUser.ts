import { UserType } from "@/types/employee";
import { api } from "@/utils/fetch";
import { jwtVerify } from "jose";
import Cookies from "js-cookie";
import { useCallback, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Context, UserContextType } from "@/store/UserContext";

const secretKey = process.env.NEXT_PUBLIC_JWT_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export const useUser = () => {
  const { user, setUser } = useContext(Context) as any;

  const setUserCb = useCallback((val: UserType) => setUser(val), [setUser]);

  const router = useRouter();
  const getMe = useCallback(async () => {
    try {
      const { data } = await api.get("/user/me");
      setUserCb(data?.data);
      const token = Cookies.get("accessToken");
      const { payload } = await jwtVerify(token || "", encodedKey, {
        algorithms: ["HS256"],
      });
      if (!token) return;

      setUser((user: UserType) => ({ ...(payload as UserType), ...user }));
      console.log(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      router.push("/login");
    }
  }, [router, setUserCb]);

  useEffect(() => {
    if (!user) {
      getMe();
    }
  }, [user]);
  return { user, setUser };
};
