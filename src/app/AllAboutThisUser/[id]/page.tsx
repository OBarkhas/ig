"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Post = {
  _id: string;
  images: string[];
  caption: string;
};

type ProfileUser = {
  _id: string;
  Username?: string;
  profilePicture?: string;
  bio?: string;
  followers?: string[];
  following?: string[];
};

export default function OtherUserProfilePage() {
  const { user, token } = useUser();
  const params = useParams();
  const [profileUser, setProfileUser] = useState<ProfileUser | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const userId = params.id;
  const isOwnProfile = userId === user?._id;
  const router = useRouter();

  const fetchUserInfo = async () => {
    const response = await fetch(`http://localhost:4000/user/${userId}`, {
      headers: { authorization: `Bearer ${token}` },
    });
    const user = await response.json();
    setProfileUser(user);
  };

  const fetchUserPosts = async () => {
    const response = await fetch(`http://localhost:4000/user-posts/${userId}`, {
      headers: { authorization: `Bearer ${token}` },
    });
    const posts = await response.json();
    setPosts(posts);
  };

  useEffect(() => {
    if (token && userId) {
      fetchUserInfo();
      fetchUserPosts();
    }
  }, [userId, token]);

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto min-h-screen">
      <div className="w-full p-4 text-center border-b border-gray-300">
        <div className="flex items-center justify-between">
          <Button onClick={() => router.push("/")}>Back</Button>
        </div>

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
        {selectedPost ? (
          <div className="flex flex-col items-center">
            <Button
              variant="secondary"
              className="mb-4"
              onClick={() => setSelectedPost(null)}
            >
              Back to posts
            </Button>
            {selectedPost.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt="Post"
                className="object-cover w-full rounded mb-2"
              />
            ))}
            <p className="text-sm mt-2">{selectedPost.caption}</p>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {posts.map((post) =>
              post.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="Post"
                  className="object-cover w-full h-32 rounded cursor-pointer"
                  onClick={() => setSelectedPost(post)}
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
