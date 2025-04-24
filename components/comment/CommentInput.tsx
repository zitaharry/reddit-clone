"use client";

import { useTransition } from "react";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { createComment } from "@/action/createComment";

const CommentInput = ({
  postId,
  parentCommentId,
}: {
  postId: string;
  parentCommentId?: string;
}) => {
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const { user } = useUser();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        const result = await createComment(postId, content, parentCommentId);

        if (result.error) {
          console.error("Error adding comment:", result.error);
        } else {
          // Clear input after successful submission
          setContent("");
        }
      } catch (error) {
        console.error("Failed to add comment:", error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
      <Input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        type="text"
        placeholder={user ? "Add a comment..." : "Sign in to comment"}
        disabled={isPending || !user}
      />
      <Button
        type="submit"
        variant="outline"
        disabled={isPending || !user || content.length === 0}
      >
        {isPending ? "Commenting..." : "Comment"}
      </Button>
    </form>
  );
}

export default CommentInput;
