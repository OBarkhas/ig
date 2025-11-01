"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "@/icons/Vector";
import { useUser } from "@/providers/AuthProvider";
import { handleUpload, upload } from "@vercel/blob/client";
import { Captions, Images, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { json } from "stream/consumers";

const Page = () => {
  const router = useRouter();
  const { token } = useUser();
  const [input, setInput] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string[]>([]);

  const HF_API_KEY = process.env.HF_API_KEY;

  const backtocreate = () => {
    router.push("/create-post");
  };

  const genrateImage = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);

    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${HF_API_KEY}`,
      };

      const response = await fetch(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              negative_prompt: "blurry, bad quality, distorted",
              num_inference_steps: 20,
              guidance_scale: 7.5,
            },
          }),
        }
      );

      const blob = await response.blob();
      const imageURL = URL.createObjectURL(blob);

      const file = new File([blob], "generated.png", { type: "image/png" });

      const uploaded = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });

      setImageUrl((prev) => {
        return [...prev, uploaded.url];
      });
    } catch (error) {
      console.error("Failed to generate image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createPost = async () => {
    const response = await fetch("`${process.env.BACKEND_URL}`post", {
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

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded">
      <div className="flex items-center gap-4 mb-4">
        <Button
          onClick={backtocreate}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          <X />
        </Button>
        <h1 className="text-xl font-semibold">New photo post</h1>
      </div>

      <div>
        <h2 className="text-lg font-medium mb-2">
          Explore AI generated images
        </h2>
        <label htmlFor="prompt" className="block mb-1">
          Describe your image
        </label>
        <Input
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Example: I'm walking in fog like Bladerunner 2049"
          className="mb-4"
        />

        <Button
          onClick={genrateImage}
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          {isLoading ? "Generating..." : "Generate"}
        </Button>

        <Button onClick={createPost}>Create post</Button>
        {/* {imageUrl && (
          <div className="mt-6">
            <h3 className="mb-2 font-medium">Generated Image:</h3>
            <p className="text-sm break-words mt-2">URL: {imageUrl}</p>
          </div>
        )} */}
        {imageUrl.map((url) => {
          return (
            <img
              src={url}
              key={url}
              alt="AI Generated"
              className="rounded shadow"
            />
          );
        })}
      </div>
      <Input
        id="input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Explain about this image"
        className="mb-4"
      />
    </div>
  );
};

export default Page;
