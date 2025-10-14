import { House } from "lucide-react";
import { Search } from "lucide-react";
import { SquarePlus } from "lucide-react";
import { CircleUserRound } from "lucide-react";
import Link from "next/link";
export const Footer = () => {
  return (
    <div className="fixed bottom-0 flex justify-between w-screen bg-white  px-8 py-4">
      <Link href="/">
        <House />
      </Link>
      <Link href="/">
        <Search />
      </Link>
      <Link href="/create-post">
        <SquarePlus />
      </Link>
      <Link href="/profilee">
        <CircleUserRound />
      </Link>
    </div>
  );
};
