import { UserType } from "@/types/employee";
import { createContext, useState } from "react";

export interface UserContextType {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
}

export const Context = createContext<UserContextType | undefined>(undefined);

export const UserContext = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);

  return (
    <Context.Provider value={{ user, setUser }}>{children}</Context.Provider>
  );
};
