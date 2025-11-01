"use client";

import { InstgramLoL } from "@/icons/Instgram";
import { User, useUser } from "@/providers/AuthProvider";
import { useState, useEffect } from "react";
import { Footer } from "./_components/Footer";
import { Heart, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
type PostType = {
  _id: string;
  caption: string;
  like: string[];
  images: string[];
  user: User;
};

const Page = () => {
  const { push } = useRouter();
  const { user, token } = useUser();
  const [posts, setPosts] = useState<PostType[]>([]);
  const myId = user?._id;
  const router = useRouter();

  const getPosts = async () => {
    const res = await fetch("http://localhost:4000/posts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      setPosts(data);
    }
  };

  useEffect(() => {
    if (!user) push("/login");
    getPosts();
  }, [token]);

  const postLike = async (postId: string) => {
    const res = await fetch(`http://localhost:4000/toggle-like/${postId}`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      await getPosts();
    } else {
      toast.error("Failed to like post");
    }
  };

  const toggleFollow = async (followedUserId: string) => {
    const res = await fetch(
      `http://localhost:4000/follow-toggle/${followedUserId}`,
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (res.ok) {
      const data = await res.json();
      toast.success(data.message);
      await getPosts();
    } else {
      toast.error("Failed to toggle follow");
    }
  };

  const handleClick = (userId: string) => {
    router.push(`/AllAboutThisUser/${userId}`);
  };

  return (
    <div>
      <div className="fixed top-0 flex justify-between w-screen bg-white px-8 py-4 z-10">
        <InstgramLoL />
      </div>

      <div className="max-w-xl mx-auto p-4 bg-gray-100 min-h-screen pt-20">
        <div className="mb-4 text-lg font-semibold">
          Welcome, {user?.Username}
        </div>

        <div className="space-y-6 mb-16">
          {posts.map((post) => {
            const isFollowed = post.user.followers?.includes(myId ?? "");

            return (
              <div
                key={post._id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-3">
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => handleClick(post.user._id)}
                  >
                    <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                    <p className="font-semibold text-sm">
                      {post.user.Username}
                    </p>
                  </div>
                  {post.user._id !== myId && (
                    <Button
                      variant={isFollowed ? "secondary" : "default"}
                      onClick={() => toggleFollow(post.user._id)}
                    >
                      {isFollowed ? "Unfollow" : "Follow"}
                    </Button>
                  )}
                </div>

                {/* {post.images?.length > 0 && (
                  <img
                    src={post.images[0]}
                    alt="post"
                    className="w-full object-cover max-h-[500px]"
                  />
                )} */}

                <Carousel className="w-full max-w-xs">
                  <CarouselContent>
                    {post.images.map((postImage, Index) => (
                      <CarouselItem key={Index}>
                        <img src={postImage} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>

                <div className="px-4 py-3">
                  <p className="text-sm">
                    <span className="font-semibold">{post.user.Username}:</span>{" "}
                    {post.caption}
                  </p>
                </div>

                <div className="flex">
                  <button
                    onClick={() => postLike(post._id)}
                    className="flex items-center gap-1 text-gray-600 hover:text-red-500 px-4 pb-3"
                  >
                    {post.like?.includes(myId ?? "") ? (
                      <Heart color="red" fill="red" />
                    ) : (
                      <Heart />
                    )}
                    <span>{post.like.length}</span>
                  </button>
                  <MessageCircle
                    onClick={() => push(`/post/${post._id}`)}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Page;
