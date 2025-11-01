// "use client";
// import { useEffect, useState } from "react";
// import { Footer } from "../_components/Footer";
// import { useUser } from "@/providers/AuthProvider";
// import { Button } from "@/components/ui/button";
// // import { toast } from "sonner";

// type Post = {
//   _id: string;
//   images: string[];
// };

// export default function ProfilePage() {
//   const { user, token } = useUser();
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [selectedPost, setSelectedPost] = useState<Post | null>(null);

//   const fetchUserPosts = async () => {
//     const res = await fetch(`${process.env.BACKEND_URL}/posts/${user?._id}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     });
//     const data = await res.json();
//     setPosts(data);
//   };

//   // const editData = async () => {
//   //   const res = await fetch("`${process.env.BACKEND_URL}`edit-user", {
//   //     method: "POST",
//   //     headers: {
//   //       Authorization: `Bearer ${token}`,
//   //       "Content-Type": "application/json",
//   //     },
//   //     body: JSON.stringify({
//   //       Username: user?.Username,
//   //     }),
//   //   });
//   //   if (res.ok) {
//   //     toast.success("sucess");
//   //   }else{
//   //     toast.error("something went wrong")
//   //   }
//   //   const data = await res.json();
//   //   setPosts(data);
//   // };

//   const LogOutt = async () => {};
//   useEffect(() => {
//     if (token) fetchUserPosts();
//   }, [token]);

//   return (
//     <div className="flex flex-col items-center w-full max-w-md mx-auto min-h-screen">
//       <div className="w-full p-4 text-center border-b border-gray-300">
//         {user?.profilePicture ? (
//           <img
//             src={user.profilePicture}
//             alt="Profile"
//             className="w-24 h-24 rounded-full mx-auto mb-2"
//           />
//         ) : (
//           <div className="w-24 h-24 rounded-full mx-auto mb-2 bg-gray-300" />
//         )}
//         <Button>Edit</Button>

//         <div className="text-lg font-semibold">{user?.Username}</div>
//         <div className="text-sm text-gray-600">{user?.bio}</div>

//         <div className="flex justify-around mt-4 text-center">
//           <div>
//             <p className="font-bold">{posts.length}</p>
//             <p className="text-sm text-gray-500">Posts</p>
//           </div>
//           <div>
//             <p className="font-bold">{user?.followers?.length ?? 0}</p>
//             <p className="text-sm text-gray-500">Followers</p>
//           </div>
//           <div>
//             <p className="font-bold">{user?.following?.length ?? 0}</p>
//             <p className="text-sm text-gray-500">Following</p>
//           </div>
//         </div>
//         <Button onClick={LogOutt}>Log-Out</Button>
//       </div>

//       <div className="flex-1 w-full p-4">
//         {selectedPost ? (
//           <div className="flex flex-col items-center">
//             <button
//               onClick={() => setSelectedPost(null)}
//               className="text-blue-500 mb-3 underline"
//             >
//               ← Back to posts
//             </button>
//             {selectedPost.images.map((img, i) => (
//               <img
//                 key={i}
//                 src={img}
//                 alt="Post detail"
//                 className="object-cover w-full rounded-lg mb-3"
//               />
//             ))}
//           </div>
//         ) : posts.length > 0 ? (
//           <div className="grid grid-cols-3 gap-2">
//             {posts.map((post) =>
//               post.images.map((img, index) => (
//                 <img
//                   key={index}
//                   src={img}
//                   alt="Post"
//                   className="object-cover w-full h-32 rounded cursor-pointer"
//                   onClick={() => setSelectedPost(post)}
//                 />
//               ))
//             )}
//           </div>
//         ) : (
//           <div className="flex flex-col items-center justify-center h-64 text-gray-500">
//             <p className="text-center">No posts yet</p>
//           </div>
//         )}
//       </div>

//       <Footer />
//     </div>
//   );
// }
"use client";
import { useEffect, useState } from "react";
import { Footer } from "../_components/Footer";
import { useUser } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Post = {
  _id: string;
  images: string[];
};

export default function ProfilePage() {
  const { user, token, setUser, setToken } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const router = useRouter();

  const fetchUserPosts = async () => {
    const res = await fetch(`${process.env.BACKEND_URL}/posts/${user?._id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setPosts(data);
  };

  const LogOutt = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    toast.success("Log out sucessful");
    router.push("/login");
  };

  useEffect(() => {
    if (token) fetchUserPosts();
  }, [token]);

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto min-h-screen">
      <div className="w-full p-4 text-center border-b border-gray-300">
        {user?.profilePicture ? (
          <img
            src={user.profilePicture}
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto mb-2"
          />
        ) : (
          <div className="w-24 h-24 rounded-full mx-auto mb-2 bg-gray-300" />
        )}

        <Button>Edit</Button>

        <div className="text-lg font-semibold">{user?.Username}</div>
        <div className="text-sm text-gray-600">{user?.bio}</div>

        <div className="flex justify-around mt-4 text-center">
          <div>
            <p className="font-bold">{posts.length}</p>
            <p className="text-sm text-gray-500">Posts</p>
          </div>
          <div>
            <p className="font-bold">{user?.followers?.length ?? 0}</p>
            <p className="text-sm text-gray-500">Followers</p>
          </div>
          <div>
            <p className="font-bold">{user?.following?.length ?? 0}</p>
            <p className="text-sm text-gray-500">Following</p>
          </div>
        </div>

        <Button onClick={LogOutt} className="mt-4 bg-red-500 text-white">
          Log-Out
        </Button>
      </div>

      <div className="flex-1 w-full p-4">
        {selectedPost ? (
          <div className="flex flex-col items-center">
            <button
              onClick={() => setSelectedPost(null)}
              className="text-blue-500 mb-3 underline"
            >
              ← Back to posts
            </button>
            {selectedPost.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="Post detail"
                className="object-cover w-full rounded-lg mb-3"
              />
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {posts.map((post) =>
              post.images.map((img, index) => (
                <img
                  key={index}
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

      <Footer />
    </div>
  );
}
