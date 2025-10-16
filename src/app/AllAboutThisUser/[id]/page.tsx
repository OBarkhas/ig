"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@/providers/AuthProvider";

type Post = {
  _id: string;
  images: string[];
};

type OtherUser = {
  _id: string;
  Username: string;
  profilePicture?: string;
  bio?: string;
  followers?: string[];
  following?: string[];
};

export default function ProfilePage() {
  const { user, token } = useUser();
  const params = useParams();
  const userId = params?.userId as string | undefined;
  const [posts, setPosts] = useState<Post[]>([]);
  const [profileUser, setProfileUser] = useState<OtherUser | null>(null);

  const fetchUserPosts = async () => {
    try {
      const res = await fetch(`http://localhost:5555/posts/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const res = await fetch(`http://localhost:5555/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch user info");
      const data = await res.json();
      setProfileUser(data);
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  useEffect(() => {
    if (token && userId) {
      fetchUserPosts();
      fetchUserInfo();
    }
  }, [token, userId]);

  const isOwnProfile = userId === user?._id;

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto min-h-screen">
      <div className="w-full p-4 text-center border-b border-gray-300">
        {profileUser?.profilePicture ? (
          <img
            src={profileUser.profilePicture}
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto mb-2"
          />
        ) : (
          <div className="w-24 h-24 rounded-full mx-auto mb-2 bg-gray-300" />
        )}

        <div className="text-lg font-semibold">
          {profileUser?.Username} {isOwnProfile && "(You)"}
        </div>
        <div className="text-sm text-gray-600">{profileUser?.bio}</div>

        <div className="flex justify-around mt-4 text-center">
          <div>
            <p className="font-bold">{posts.length}</p>
            <p className="text-sm text-gray-500">Posts</p>
          </div>
          <div>
            <p className="font-bold">{profileUser?.followers?.length ?? 0}</p>
            <p className="text-sm text-gray-500">Followers</p>
          </div>
          <div>
            <p className="font-bold">{profileUser?.following?.length ?? 0}</p>
            <p className="text-sm text-gray-500">Following</p>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full p-4">
        {posts.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {posts.map((post) =>
              post.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="Post"
                  className="object-cover w-full h-32 rounded"
                />
              ))
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <p className="text-center">No posts yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
