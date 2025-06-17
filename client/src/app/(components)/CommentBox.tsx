import React, { useEffect, useState } from "react";
import {
  useCreateCommentMutation,
  useLazyGetCommentsByTaskIdQuery,
} from "@/store/api";

import { IComment } from "@/types/user.types";
import { User } from "lucide-react";
import UserAvatar from "./molecules/UserAvatar";
import { toast } from "react-toastify";

type Props = {
  handleCancel: () => void;
  taskId: number;
  comment: IComment | undefined;
};

const CommentBox = ({ handleCancel, taskId, comment }: Props) => {
  const [createCommentMutation] = useCreateCommentMutation();
  const [fetchCommentsByTaskId] = useLazyGetCommentsByTaskIdQuery();
  const [content, setContent] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (comment?.id) {
      setContent(comment?.content || "");
    }
  }, [comment]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const response = await createCommentMutation({
        content: content,
        task: taskId,
        addedBy: 1,
      }).unwrap();

      fetchCommentsByTaskId({ taskId: taskId });
      setContent("");
      handleCancel();

      console.log(response);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="rounded-md border border-gray-200 p-1">
      <div className="flex-1">
        <textarea
          className="min-h-[80px] w-full resize-y rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-blue-200"
          placeholder="Add a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
        />
        <div className="flex items-center justify-end gap-4 p-2">
          <button
            onClick={handleCancel}
            className="rounded-md bg-gray-100 px-4 py-1.5 text-gray-600 hover:bg-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={() => handleSubmit()}
            disabled={isSubmitting}
            className="rounded-sm bg-blue-500 px-4 py-1 text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {isSubmitting ? "Commenting..." : "Comment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentBox;
