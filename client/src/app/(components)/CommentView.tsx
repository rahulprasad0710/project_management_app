import { Edit, Ellipsis, Trash } from "lucide-react";

import CommentBox from "./CommentBox";
import { IComment } from "@/types/user.types";
import React from "react";
import UserAvatar from "./molecules/UserAvatar";
import { format } from "date-fns";

type Props = {
  comment: IComment;
};

const CommentView = ({ comment }: Props) => {
  const [toggleMenu, setToggleMenu] = React.useState(false);
  const [isCommentBoxOpen, setIsCommentBoxOpen] = React.useState(false);

  const { task } = comment;

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
          taskId={task}
          comment={comment}
          handleCancel={() => setIsCommentBoxOpen(false)}
        />
      ) : (
        <div className="flex cursor-pointer gap-3 rounded-md p-2 py-2 shadow-sm transition-colors duration-200 hover:bg-gray-100">
          <div className="mr-2 flex w-[96] items-center gap-2">
            <div className="relative flex flex-col items-center gap-2 p-2">
              <UserAvatar size="sm" user={comment.addedBy} />
              <button
                onClick={() => handleOpenMenu()}
                className="px-2 hover:bg-gray-200"
              >
                <Ellipsis className="h-4 w-4 text-gray-500" />
              </button>
              {toggleMenu && (
                <div className="absolute bottom-0 left-12 flex gap-2 rounded-sm bg-white p-1">
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
          <div className="flex-1 text-sm text-gray-800">
            <div className="flex w-full justify-end text-xs text-gray-500">
              {format(comment?.addedAt ?? new Date(), "dd-MM-yyyy hh:mm a")}
            </div>
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
