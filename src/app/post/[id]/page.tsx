"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/providers/AuthProvider";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Comment = {
  _id: string;
  comment: string;
  user: { Username: string; profilePicture?: string };
};

export default function PostCommentsPage() {
  const { id } = useParams();
  const { token } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const router = useRouter();
  const getComments = async () => {
    const res = await fetch(`${process.env.BACKEND_URL}/comment/get/${id}`, {
      headers: { authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setComments(await res.json());
    }
  };

  const createComment = async () => {
    const res = await fetch("`${process.env.BACKEND_URL}`comment/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ postId: id, comment: newComment }),
    });

    if (res.ok) {
      setNewComment("");
      await getComments();
      toast.success("Comment added!");
    } else {
      toast.error("Failed to add comment");
    }
  };

  useEffect(() => {
    getComments();
  }, [id]);

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-bold mb-4">Comments</h2>

      <Button onClick={() => router.push("/")}>Back</Button>
      <div className="space-y-2 mb-4">
        {comments.map((c) => (
          <div
            key={c._id}
            className="border-b border-gray-200 pb-2 text-sm flex gap-2"
          >
            <div className="font-semibold">{c.user?.Username}:</div>
            <div>{c.comment}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Write a comment..."
          className="flex-1 border rounded-lg px-3 py-2"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button onClick={createComment}>Send</Button>
      </div>
    </div>
  );
}
