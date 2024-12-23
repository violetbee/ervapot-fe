"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import axios from "axios";
import { redirect } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const authHandler = async (e: FormEvent) => {
    e.preventDefault();
    const res = await axios.post(
      "http://localhost:5000/auth/login",
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );

    if (res.status === 200) {
      redirect("/");
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
          className="mt-4 py-2 hover:bg-indigo-400 hover:text-white duration-200 border-[1px] border-indigo-400 rounded-md"
          type="submit"
        >
          Giriş Yap
        </button>
      </form>
    </div>
  );
};

export default Login;
