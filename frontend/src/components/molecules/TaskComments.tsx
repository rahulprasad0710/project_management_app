import React, { useEffect } from "react";

import CommentBox from "@molecules/CommentBox";
import CommentView from "@molecules/CommentView";
import { useLazyGetCommentsByTaskIdQuery } from "@api/hooks/useComment";

type Props = {
    taskId: number;
};

const TaskComments = ({ taskId }: Props) => {
    const [isCommentBoxOpen, setIsCommentBoxOpen] = React.useState(false);
    const [fetchCommentsByTaskId, { data, isLoading, error }] =
        useLazyGetCommentsByTaskIdQuery();
    console.log({
        taskId,
    });
    useEffect(() => {
        if (taskId) {
            fetchCommentsByTaskId({ taskId: taskId });
        }
    }, [fetchCommentsByTaskId, taskId]);

    if (isLoading) return <div>Loading...</div>;

    if (data?.data === undefined || error) return <div>Task not found </div>;
    return (
        <div className='mt-4 rounded-sm border border-gray-200 p-4'>
            <div className='max-h-[300px] overflow-y-auto'>
                {data?.data?.map((comment) => (
                    <CommentView key={comment.id} comment={comment} />
                ))}
            </div>
            {isCommentBoxOpen && (
                <CommentBox
                    comment={undefined}
                    taskId={taskId}
                    handleCancel={() => setIsCommentBoxOpen(false)}
                />
            )}

            <div className='flex items-center justify-end gap-4'>
                {!isCommentBoxOpen && (
                    <button
                        onClick={() => setIsCommentBoxOpen(true)}
                        className='rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600'
                    >
                        Add Comment
                    </button>
                )}
            </div>
        </div>
    );
};

export default TaskComments;

{
    /* <div className="text-sm">
  <div>
    {comment.addedBy.firstName} {comment.addedBy.lastName}
  </div>
  <div className="text-sm text-gray-500">
    {format(comment.addedAt ?? new Date(), "dd-MM-yyyy hh:mm a")}
  </div>
</div>; */
}
