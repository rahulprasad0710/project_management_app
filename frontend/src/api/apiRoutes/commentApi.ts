import type { BaseQueryFn, FetchArgs } from "@reduxjs/toolkit/query/react";
import type {
    EndpointBuilder,
    FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
//
import type {
    IActivityResponse,
    IComment,
    ICommentPayload,
    ICommentUpdatePayload,
    Response,
} from "@/types/config.types";

import type { SerializedError } from "@reduxjs/toolkit";

export const commentEndpoints = (
    build: EndpointBuilder<
        BaseQueryFn<
            string | FetchArgs,
            unknown,
            FetchBaseQueryError | SerializedError
        >,
        string,
        "api"
    >
) => ({
    getCommentsByTaskId: build.query<Response<IComment[]>, { taskId: number }>({
        query: ({ taskId }) => ({
            url: `tasks/${taskId}/comments`,
            method: "GET",
        }),
        providesTags: (result, error, taskId) =>
            result
                ? [
                      ...result.data.map((comment) => ({
                          type: "Comments" as const,
                          id: comment.id,
                      })),
                      { type: "Comments" as const, id: `TASK_${taskId}` },
                  ]
                : [{ type: "Comments", id: `TASK_${taskId}` }],
    }),
    // 2. Add comment
    createComment: build.mutation<Response<IComment>, ICommentPayload>({
        query: ({ task, ...payload }) => ({
            url: `tasks/${task}/comments`,
            method: "POST",
            body: payload,
        }),
        invalidatesTags: (result, error, { task }) => [
            { type: "Comments", id: `TASK_${task}` },
        ],
    }),

    // 3. Update comment
    updateComment: build.mutation<
        Response<IComment>,
        ICommentUpdatePayload & { id: number }
    >({
        query: ({ id, ...payload }) => ({
            url: `comments/${id}`,
            method: "PUT",
            body: payload,
        }),
        invalidatesTags: (result, error, { id }) => [{ type: "Comments", id }],
    }),

    // 4. Soft delete comment
    deleteComment: build.mutation<Response<IComment>, { commentId: number }>({
        query: ({ commentId }) => ({
            url: `comments/${commentId}`,
            method: "PUT",
        }),
        invalidatesTags: (result, error, commentId) => [
            { type: "Comments", commentId },
        ],
    }),
    // Task Activity
    getActivityByTaskId: build.query<
        Response<IActivityResponse[]>,
        { taskId: number }
    >({
        query: ({ taskId }) => ({
            url: `tasks/${taskId}/activities`,
            method: "GET",
        }),
        providesTags: (result, error, taskId) =>
            result
                ? [
                      ...result.data.map((activity) => ({
                          type: "Activity" as const,
                          id: activity.id,
                      })),
                      { type: "Activity" as const, id: `TASK_${taskId}` },
                  ]
                : [{ type: "Activity", id: `TASK_${taskId}` }],
    }),
});
