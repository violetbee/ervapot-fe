"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const authHandler = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`,
        {
          email,
          password,
        }
      );
      localStorage.setItem("accessToken", res.data.tokens.accessToken);
      localStorage.setItem("refreshToken", res.data.tokens.refreshToken);
      toast.success(res.data.message);
      router.push("/");
    } catch (err) {
      toast.error(err?.response?.data?.error);
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 rounded-xl bg-white border-[1px] shadow-sm flex flex-col gap-5">
      <Image
        alt="logo"
        src="/images/ervapot-logo.png"
        width={250}
        height={200}
      />
      <h1 className="text-xl font-medium opacity-70">Kullanıcı Girişi</h1>
      <form onSubmit={authHandler} className="flex flex-col gap-2">
        <input
          className="px-2 py-1 border-b-[1px] focus:outline-none"
          type="email"
          name="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="px-2 py-1 border-b-[1px] focus:outline-none"
          type="password"
          name="password"
          placeholder="şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="mt-4 py-2 hover:bg-indigo-400 hover:text-white duration-200 border-[1px] border-indigo-400 rounded-md disabled:bg-black/[0.1] disabled:border-black/[0.1]"
          type="submit"
          disabled={isLoading}
        >
          Giriş Yap
        </button>
      </form>
    </div>
  );
};

export default Login;
