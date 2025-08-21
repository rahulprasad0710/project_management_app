import type { BaseQueryFn, FetchArgs } from "@reduxjs/toolkit/query/react";
import type {
    EndpointBuilder,
    FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
//
import type {
    IAddProjectPayload,
    IProject,
    IProjectPagination,
    IProjectTaskPagination,
    ITask,
    IUpdateProjectPayload,
    Response,
    ResponseWithPagination,
} from "@/types/config.types";

import type { SerializedError } from "@reduxjs/toolkit";

export const projectEndpoints = (
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
    getProjects: build.query<
        ResponseWithPagination<IProject[]>,
        IProjectPagination
    >({
        query: ({
            isPaginationEnabled = true,
            page = 1,
            pageSize = 10,
            keyword,
            status,
            priority,
        }) => ({
            url: "projects",
            method: "GET",
            params: {
                isPaginationEnabled,
                page,
                pageSize,
                keyword: keyword ? keyword : undefined,
                status,
                priority,
            },
        }),
        providesTags: (result) =>
            result
                ? [
                      ...result.data.result.map((project) => ({
                          type: "Projects" as const,
                          id: project.id,
                      })),
                      { type: "Projects" as const, id: "LIST" },
                  ]
                : [{ type: "Projects" as const, id: "LIST" }],
    }),
    getProjectById: build.query<Response<IProject>, { projectId: number }>({
        query: ({ projectId }) => ({
            url: `projects/${projectId}?withTask=true`,
            method: "GET",
        }),
    }),
    getProjectTaskByProjectId: build.query<
        ResponseWithPagination<ITask[]>,
        IProjectTaskPagination
    >({
        query: ({
            isPaginationEnabled = false,
            page = 1,
            pageSize = 10,
            keyword,
            labels,
            priority,
            projectId,
            assignedTo,
        }) => ({
            url: `projects/tasks/${projectId}`,
            method: "GET",
            params: {
                isPaginationEnabled,
                page,
                pageSize,
                keyword: keyword ? keyword : undefined,
                labels,
                priority,
                assignedTo,
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
    createProject: build.mutation<Response<IProject>, IAddProjectPayload>({
        query: (payload) => ({
            url: "projects",
            method: "POST",
            body: payload,
        }),
        invalidatesTags: [{ type: "Projects", id: "LIST" }],
    }),
    updateProject: build.mutation<Response<IProject>, IUpdateProjectPayload>({
        query: ({ projectId, ...payload }) => ({
            url: `projects/${projectId}`,
            method: "PUT",
            body: payload,
        }),
        invalidatesTags: [{ type: "Projects", id: "LIST" }],
    }),
});
