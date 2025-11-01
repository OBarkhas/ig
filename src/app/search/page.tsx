"use client";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Footer } from "../_components/Footer";
import { User, useUser } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";

const Page = () => {
  const { token } = useUser();
  const [searchValue, setSearchValue] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  const getUsers = async () => {
    const response = await fetch(
      `http://localhost:5555/users/${searchValue === "" ? null : searchValue}`,
      {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    const users = await response.json();
    setUsers(users);
  };

  useEffect(() => {
    if (token) getUsers();
  }, [searchValue, token]);

  const handleClick = (userId: string) => {
    router.push(`/AllAboutThisUser/${userId}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gray-50 text-gray-900">
      <div className="w-full max-w-lg mt-10 px-4">
        <h1 className="text-2xl font-semibold mb-4 text-center">
          🔍 Search User
        </h1>

        <div className="relative mb-6">
          <Input
            placeholder="Search Option..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-xl p-3 shadow-sm transition-all duration-300"
          />
          <span className="absolute right-3 top-3 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
              />
            </svg>
          </span>
        </div>

        <div className="space-y-3">
          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user._id}
                className="p-4 bg-white rounded-xl shadow hover:shadow-lg transition duration-300 border border-gray-200 flex items-center justify-between"
              >
                <span className="font-medium">{user.Username}</span>
                <button
                  className="text-sm text-blue-600 hover:text-blue-800 transition"
                  onClick={() => handleClick(user._id)}
                >
                  View Profile
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center">Type to search users...</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Page;
