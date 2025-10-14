"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { decodedtokentype, useUser } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IgLogo } from "@/icons/ig-logo";
import { jwtDecode } from "jwt-decode";

const LoginPage = () => {
  const { setUser, token, setToken } = useUser();
  const { push } = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const response = await fetch("http://localhost:5555/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        Email: email,
        Password: password,
      }),
    });
    if (response.ok) {
      const token = await response.json();
      localStorage.setItem("token", token);
      setToken(token);
      const decodedtoken: decodedtokentype = jwtDecode(token);
      setUser(decodedtoken.data);
      push("/");
      toast.success("orchlo byr hurgi");
    } else {
      toast.error("pass esul email chin hudla bna");
    }
  };

  useEffect(() => {
    if (token) {
      push("/");
    }
  }, [token]);

  return (
    <div>
      <IgLogo />
      <div className="flex mr-4 ml-4 mt-40 flex-col gap-4 border-2 border-blue-600 p-4 ">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={login}
        >
          Log in
        </Button>
        <h1 className="text-center">OR</h1>
        <div className="flex justify-center">
          <div>Dont Have An Account?-</div>
          <div
            className="text-blue-500 cursor-pointer"
            onClick={() => push("/sign-up")}
          >
            Sign-up
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
