import { Edit, Ellipsis, Trash } from "lucide-react";

import CommentBox from "./CommentBox";
import { IComment } from "@/types/user.types";
import React from "react";
import UserAvatar from "./molecules/UserAvatar";

type Props = {
  comment: IComment;
};

const CommentView = ({ comment }: Props) => {
  const [toggleMenu, setToggleMenu] = React.useState(false);
  const [isCommentBoxOpen, setIsCommentBoxOpen] = React.useState(false);

  const { taskId } = comment;

  const handleOpenMenu = () => {
    setToggleMenu(!toggleMenu);
  };

  const handleEditComment = () => {
    setIsCommentBoxOpen(true);
  };

  return (
    <div key={comment.id}>
      {isCommentBoxOpen ? (
        <CommentBox
          taskId={taskId}
          comment={comment}
          handleCancel={() => setIsCommentBoxOpen(false)}
        />
      ) : (
        <div className="mt-2 flex flex-row items-center border">
          <div className="mr-2 flex w-[96] items-center gap-2">
            <div className="relative flex flex-col items-center gap-2 border-r border-gray-200 p-2">
              <UserAvatar user={comment.addedBy} />
              <button
                onClick={() => handleOpenMenu()}
                className="px-2 hover:bg-gray-200"
              >
                <Ellipsis className="h-4 w-4 text-gray-500" />
              </button>
              {toggleMenu && (
                <div className="absolute bottom-0 left-12 flex gap-2 rounded-sm border border-gray-200 bg-white p-1">
                  <button className="flex items-center gap-2 rounded bg-gray-100 p-1 hover:bg-gray-200">
                    <Trash className="h-4 w-4 text-red-400" />
                  </button>
                  <button className="flex items-center gap-2 rounded bg-gray-100 p-1 hover:bg-gray-200">
                    <Edit
                      onClick={handleEditComment}
                      className="h-4 w-4 text-blue-400"
                    />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="w-full flex-grow rounded-lg p-2">
            <div
              dangerouslySetInnerHTML={{
                __html: comment.content as string,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentView;
