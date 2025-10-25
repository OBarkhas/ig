"use client";

import { Button } from "@/components/ui/button";
import { GG } from "@/icons/gg";

import { X } from "@/icons/Vector";
import { useRouter } from "next/navigation";

const CreatePost = () => {
  const router = useRouter();

  const goToGeneratePhoto = () => {
    router.push("/genrate-ai");
  };
  const goTohome = () => {
    router.push("/");
  };
  const gotoImage = () => {
    router.push("/Image-up");
  };
  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded ">
      <div className="flex align-center gap-4">
        <Button
          onClick={goTohome}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          <X />
        </Button>
        <h1>New photo post</h1>
      </div>
      <div>
        <GG />
        <Button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={gotoImage}
        >
          Photo Library
        </Button>
        <Button
          onClick={goToGeneratePhoto}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          generate with Ai
        </Button>
      </div>
    </div>
  );
};
export default CreatePost;
