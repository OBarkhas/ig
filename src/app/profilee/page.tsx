"use client";
import { useEffect, useState } from "react";
import { Footer } from "../_components/Footer";

type User = {
  _id: string;
  Username: string;
  fullname?: string;
  bio?: string;
  followers: string[];
  following: string[];
  profilePicture?: string;
};

type Post = {
  _id: string;
  images: string[];
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    (async () => {
      const userRes = await fetch("http://localhost:3000/profilee", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData: User = await userRes.json();
      setUser(userData);

      if (!userData._id) return;

      const postRes = await fetch(
        `http://localhost:5555/posts/${userData._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const postData: Post[] = await postRes.json();
      setPosts(postData);
    })();
  }, []);

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      {user && (
        <>
          <div className="text-lg font-semibold mt-3">{user.Username}</div>
          {user.profilePicture && (
            <img
              src={user.profilePicture}
              alt="Profile"
              className="w-24 h-24 rounded-full mt-2"
            />
          )}
          <div className="mt-2">{user.bio}</div>
        </>
      )}

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
