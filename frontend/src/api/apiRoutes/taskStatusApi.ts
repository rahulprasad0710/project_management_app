import type { BaseQueryFn, FetchArgs } from "@reduxjs/toolkit/query/react";
import type {
    EndpointBuilder,
    FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
//
import type {
    ITaskStatusPayload,
    ITaskStatusResponse,
    ITaskStatusUpdatePayload,
    Pagination,
    Response,
    ResponseWithPagination,
} from "@/types/config.types";

import type { SerializedError } from "@reduxjs/toolkit";

export const taskStatusEndpoints = (
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
    getAllTaskStatus: build.query<
        ResponseWithPagination<ITaskStatusResponse[]>,
        Pagination
    >({
        query: ({
            isPaginationEnabled = true,
            page = 1,
            pageSize = 10,
            keyword,
        }) => ({
            url: "settings/task-status",
            method: "GET",
            params: {
                isPaginationEnabled,
                page,
                pageSize,
                keyword: keyword ? keyword : undefined,
            },
        }),
        providesTags: (result) =>
            result
                ? [
                      ...result.data.result.map((label) => ({
                          type: "TaskStatus" as const,
                          id: label.id,
                      })),
                      { type: "TaskStatus" as const, id: "LIST" },
                  ]
                : [{ type: "TaskStatus" as const, id: "LIST" }],
    }),
    getTaskStatusById: build.query<
        Response<ITaskStatusResponse>,
        { taskStatusId: number }
    >({
        query: ({ taskStatusId }) => ({
            url: `task-status/${taskStatusId}`,
            method: "GET",
        }),
    }),
    createTaskStatus: build.mutation<
        Response<ITaskStatusResponse>,
        ITaskStatusPayload
    >({
        query: (payload) => ({
            url: "/settings/task-status",
            method: "POST",
            body: payload,
        }),
        invalidatesTags: [{ type: "TaskStatus", id: "LIST" }],
    }),

    updateTaskStatus: build.mutation<
        Response<ITaskStatusResponse>,
        ITaskStatusUpdatePayload
    >({
        query: ({ id, ...payload }) => ({
            url: `/settings/task-status/${id}`,
            method: "PUT",
            body: payload,
        }),
        invalidatesTags: (result, error, { id }) => [
            { type: "TaskStatus", id },
            { type: "TaskStatus", id: "LIST" },
        ],
    }),

    updateTaskStatusStatus: build.mutation<
        Response<ITaskStatusResponse>,
        { taskStatusId: number; isActive: boolean }
    >({
        query: ({ taskStatusId, isActive }) => ({
            url: `task-status/${taskStatusId}/status`,
            method: "PUT",
            body: { isActive },
        }),
        invalidatesTags: (result, error, { taskStatusId }) => [
            { type: "TaskStatus", id: taskStatusId },
            { type: "TaskStatus", id: "LIST" },
        ],
    }),
});
