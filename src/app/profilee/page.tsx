"use client";
import { useEffect, useState } from "react";
import { Footer } from "../_components/Footer";
import { useUser } from "@/providers/AuthProvider";

type Post = {
  _id: string;
  images: string[];
};

export default function ProfilePage() {
  const { user, token } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const fetchUserPosts = async () => {
    const userRes = await fetch(`http://localhost:5555/posts/${user?._id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const userData = await userRes.json();
    setPosts(userData);
  };

  useEffect(() => {
    if (token) fetchUserPosts();
  }, [token]);

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      <div className="text-lg font-semibold mt-3">{user?.Username}</div>
      {user?.profilePicture && (
        <img
          src={user.profilePicture}
          alt="Profile"
          className="w-24 h-24 rounded-full mt-2"
        />
      )}
      <div className="mt-2">{user?.bio}</div>

      <div className="mt-4 w-full">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="mb-4">
              {post.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="Post"
                  className="w-full mb-2 rounded"
                />
              ))}
            </div>
          ))
        ) : (
          <div>No posts yet</div>
        )}
      </div>
      <Footer />
    </div>
  );
}
