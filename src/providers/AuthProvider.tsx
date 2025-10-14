"use client";

import { jwtDecode } from "jwt-decode";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

type User = {
  _id: string;
  Email: string;
  Password: string;
  Username: string;
  bio: string | null;
  profilePicture: string | null;
  followers: string | null;
  following: string | null;
};

type AuthContextType = {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  setToken: Dispatch<SetStateAction<string | null>>;
  token: string | null;
};

export type decodedtokentype = {
  data: User;
};
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // if (typeof window !== "undefined") return;

    const localToken = localStorage.getItem("token");

    if (localToken) {
      setToken(localToken);
      const decodedtoken: decodedtokentype = jwtDecode(localToken);
      setUser(decodedtoken.data);
    }
  }, []);

  const values = {
    user,
    setUser,
    token,
    setToken,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};
export const useUser = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error(
      "Auth context ashiglahin tuld zaaval provider dotor bh heregtei!"
    );
  }
  return authContext;
};
