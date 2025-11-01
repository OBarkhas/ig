"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IgLogo } from "@/icons/ig-logo";
import { toast } from "sonner";
import { decodedtokentype, useUser } from "@/providers/AuthProvider";
import { jwtDecode } from "jwt-decode";

type Credentials = {
  email: string;
  password: string;
  username: string;
};

const Page = () => {
  const router = useRouter();
  const { push } = useRouter();
  const { setUser, setToken } = useUser();
  const [credentials, setCredentials] = useState<Credentials>({
    email: "",
    password: "",
    username: "",
  });

  const signUp = async () => {
    const response = await fetch("`${process.env.BACKEND_URL}`sign-up", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        Email: credentials.email,
        Password: credentials.password,
        Username: credentials.username,
      }),
    });

    if (response.ok) {
      const token = await response.json();
      localStorage.setItem("token", token);
      setToken(token);
      const decodedtoken: decodedtokentype = jwtDecode(token);
      setUser(decodedtoken.data);
      toast.success("orchlo byr hurgi");
      push("/");
    } else {
      toast.error("pass esul email chin ali hedin hereglegdsen bna");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded ">
      <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>
      <IgLogo />
      <input
        type="text"
        placeholder="Username"
        value={credentials.username}
        onChange={(e) =>
          setCredentials((prev) => ({ ...prev, username: e.target.value }))
        }
        className="w-full p-2 mb-4 border rounded"
      />
      <input
        type="email"
        placeholder="Email"
        value={credentials.email}
        onChange={(e) =>
          setCredentials((prev) => ({ ...prev, email: e.target.value }))
        }
        className="w-full p-2 mb-4 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={(e) =>
          setCredentials((prev) => ({ ...prev, password: e.target.value }))
        }
        className="w-full p-2 mb-4 border rounded"
      />

      <button
        onClick={signUp}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Sign-Up
      </button>

      <p className="mt-4 text-center">
        Already have an account?{" "}
        <span
          className="text-blue-600 cursor-pointer"
          onClick={() => router.push("/login")}
        >
          Login
        </span>
      </p>
    </div>
  );
};

export default Page;
