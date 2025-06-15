import { Plus } from "lucide-react";
import React from "react";
import TextEditor from "./TextEditor";

const CommentBox = () => {
  return (
    <div className="rounded-md border border-gray-200 p-1">
      <TextEditor />
      <div className="flex items-center justify-end gap-4 border-t border-gray-200 p-2">
        <button className="hover:bg-gary-200 translate-x-1 rounded bg-gray-200 px-2 py-2 font-medium text-black hover:bg-gray-300">
          Cancel
        </button>

        <button className="rounded bg-blue-600 px-2 py-2 font-medium text-white hover:bg-blue-700">
          Add Comment
        </button>
      </div>
    </div>
  );
};

export default CommentBox;
