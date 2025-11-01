"use client";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useState } from "react";
import { Footer } from "../_components/Footer";
import { upload } from "@vercel/blob/client";
import { Button } from "@/components/ui/button";
import { useUser } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";

const Page = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const { token } = useUser();
  const [imageUrl, setImageUrl] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const handlFile = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
  };

  const createPost = async () => {
    const response = await fetch(`${process.env.BACKEND_URL}/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        caption: input,
        images: imageUrl,
      }),
    });
    const newPost = await response.json();
    alert("Post created successful!");
    router.push("/");
  };

  const uploadImage = async () => {
    if (!file) return;
    setIsUploading(true);

    try {
      const uploaded = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });
      setImageUrl((prev) => [...prev, uploaded.url]);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Try again!");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 mt-10 mb-10">
        <h1 className="text-2xl font-semibold text-center text-blue-600 mb-6">
          Create a New Post
        </h1>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-3 border-2 border-dashed border-blue-300 rounded-xl p-4 hover:border-blue-500 transition">
            <Input
              type="file"
              accept="image/*"
              onChange={handlFile}
              className="cursor-pointer"
            />

            <Button
              onClick={uploadImage}
              disabled={isUploading}
              className={`w-full text-white transition ${
                isUploading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isUploading ? "Uploading..." : "Upload Image"}
            </Button>
          </div>

          <Input
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Explain about this image..."
            className="mt-4"
          />

          <Button
            onClick={createPost}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 mt-2 rounded-xl"
          >
            Create Post
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Page;
