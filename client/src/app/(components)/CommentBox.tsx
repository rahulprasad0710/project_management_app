import React, { useEffect, useState } from "react";
import {
  useCreateCommentMutation,
  useLazyGetCommentsByTaskIdQuery,
} from "@/store/api";

import { Editor } from "@tiptap/react";
import { IComment } from "@/types/user.types";
import TextEditor from "./TextEditor";
import { toast } from "react-toastify";

type Props = {
  handleCancel: () => void;
  taskId: number;
  comment: IComment | undefined;
};

const CommentBox = ({ handleCancel, taskId, comment }: Props) => {
  const [createCommentMutation] = useCreateCommentMutation();
  const [fetchCommentsByTaskId] = useLazyGetCommentsByTaskIdQuery();
  const [editorContent, setEditorContent] = useState("type here....");

  const [editorInstance, setEditorInstance] = useState<Editor>();
  useEffect(() => {
    if (comment?.id && editorInstance) {
      console.log({ commentContent: comment?.content });
      editorInstance.commands.setContent(comment?.content || "");
    }
  }, [comment, editorInstance]);

  const handleSubmit = async () => {
    try {
      const response = await createCommentMutation({
        content: editorContent,
        task: taskId,
        addedBy: 1,
      }).unwrap();

      fetchCommentsByTaskId({ taskId: taskId });
      setEditorContent("");
      handleCancel();

      console.log(response);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="rounded-md border border-gray-200 p-1">
      <TextEditor
        editorContent={editorContent}
        setEditorContent={setEditorContent}
        setEditorInstance={setEditorInstance}
      />
      <div className="flex items-center justify-end gap-4 border-t border-gray-200 p-2">
        <button
          onClick={handleCancel}
          className="hover:bg-gary-200 translate-x-1 rounded bg-gray-200 px-2 py-1 text-black hover:bg-gray-300"
        >
          Cancel
        </button>

        <button
          onClick={() => handleSubmit()}
          className="rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
        >
          Add Comment
        </button>
      </div>
    </div>
  );
};

export default CommentBox;
