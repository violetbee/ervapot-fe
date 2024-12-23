import { jwtVerify } from "jose";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { api } from "./fetch";
import { User } from "@/types/user";

const secretKey = process.env.NEXT_PUBLIC_JWT_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export const getSession = async () => {
  const session = (await cookies()).get("accessToken")?.value;
  const path = (await headers()).get("x-current-path");
  if (!session && path !== "/login") {
    redirect("/login");
  }
  const user = await decrypt(session);
  return user as unknown as User;
};

export const decrypt = async (session: string | undefined = "") => {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {}
};

export async function refreshSession(token: string) {
  try {
    const { data } = await api.post("/auth/refresh-token", undefined, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    return data; // Yeni `accessToken` ve metadata
  } catch (error) {
    console.error("Failed to refresh session:", error);
    return null;
  }
}
