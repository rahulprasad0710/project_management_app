import type { BaseQueryFn, FetchArgs } from "@reduxjs/toolkit/query/react";
import type {
    EndpointBuilder,
    FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
//
import type {
    ITask,
    ITaskPagination,
    ITaskPayload,
    Response,
    ResponseWithPagination,
} from "@/types/config.types";

import type { SerializedError } from "@reduxjs/toolkit";

export const taskEndpoints = (
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
    getTasks: build.query<ResponseWithPagination<ITask[]>, ITaskPagination>({
        query: ({
            isPaginationEnabled = false,
            page = 1,
            pageSize = 10,
            keyword,
            labels,
            priority,
            projectId,
            assignedTo,
            featureId,
        }) => ({
            url: `tasks/${projectId}`,
            method: "GET",
            params: {
                isPaginationEnabled,
                page,
                pageSize,
                keyword: keyword ? keyword : undefined,
                labels,
                priority,
                assignedTo,
                featureId,
            },
        }),
        providesTags: (result) =>
            result?.data
                ? result.data.result?.map(({ id }) => ({
                      type: "ProjectTasks" as const,
                      id,
                  }))
                : [{ type: "ProjectTasks" as const }],
    }),
    getTasksByTaskId: build.query<Response<ITask>, { taskId: number }>({
        query: ({ taskId }) => ({
            url: `tasks/${taskId}`,
            method: "GET",
        }),
    }),
    getTasksByProjectId: build.query<ITask[], { projectId: number }>({
        query: ({ projectId }) => ({
            url: `tasks/projects/${projectId}?withTask=true`,
            method: "GET",
            providesTags: (result: ITask[]) =>
                result
                    ? result?.map(({ id }) => ({ type: "Tasks" as const, id }))
                    : [
                          {
                              type: "Tasks" as const,
                          },
                      ],
        }),
    }),
    createTasks: build.mutation<Response<ITask>, ITaskPayload>({
        query: (payload) => ({
            url: "tasks",
            method: "POST",
            body: payload,
        }),
        invalidatesTags: ["Tasks"],
    }),
    updateTaskStatus: build.mutation<Response<ITask>, Partial<ITask>>({
        query: ({ id, status }) => ({
            url: `tasks/status/${id}`,
            method: "PUT",
            body: { status },
        }),
        invalidatesTags: [{ type: "ProjectTasks", id: "LIST" }],
    }),
});
