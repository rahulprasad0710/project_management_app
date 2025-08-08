import { ActivityAction } from "@/enums/utils";
import type { IActivityResponse } from "@/types/config.types";
import { Link } from "react-router-dom";

type Props = {
    item: IActivityResponse;
};

const CreatePost = ({ item }: Props) => {
    const { action, task, activityBy, id } = item;

    if (action === ActivityAction.COMMENTED_TICKET) {
        return (
            <p className='mb-2' key={id}>
                <span className='font-semibold'>
                    {activityBy.id === task.assignedTo.id ? (
                        "You"
                    ) : (
                        <>
                            {activityBy.firstName} {activityBy.lastName}
                        </>
                    )}
                </span>{" "}
                commented on task :{" "}
                <Link
                    href={`/project/${task.projectId}?openTask=${task.id}&openCommentTab=true`}
                    className='font-semibold text-blue-600 underline'
                >
                    {task.taskNumber}
                </Link>{" "}
                assigned to you.
            </p>
        );
    }
    if (action === ActivityAction.EDITED_COMMENT) {
        return (
            <p key={id}>
                <span className='font-semibold'>
                    {activityBy.firstName} ${activityBy.lastName}
                </span>{" "}
                edited a comment on task :{" "}
                <Link
                    href={`/project/${task.projectId}/${task.id}?openCommentTab=true`}
                >
                    <span className='font-semibold text-blue-600'>
                        {" "}
                        {task.taskNumber}
                    </span>
                </Link>{" "}
                assigned to you.
            </p>
        );
    }
    if (action === ActivityAction.DELETED_COMMENT) {
        return (
            <p key={id}>
                <span className='font-semibold'>
                    {activityBy.firstName} ${activityBy.lastName}
                </span>{" "}
                deleted a comment on task :{" "}
                <Link
                    href={`/project/${task.projectId}/${task.id}?openCommentTab=true`}
                >
                    {task.taskNumber}
                </Link>{" "}
                assigned to you.
            </p>
        );
    }
};

export default CreatePost;
