import type { BaseQueryFn, FetchArgs } from "@reduxjs/toolkit/query/react";
import type {
    EndpointBuilder,
    FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
//
import type {
    ISprintPayload,
    ISprintResponse,
    Response,
    ResponseWithPagination,
    SprintPagination,
} from "@/types/config.types";

import type { SerializedError } from "@reduxjs/toolkit";

export const sprintEndpoints = (
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
    getSprints: build.query<
        ResponseWithPagination<ISprintResponse[]>,
        SprintPagination
    >({
        query: ({
            isPaginationEnabled = true,
            page = 1,
            pageSize = 10,
            keyword,
            isActive,
        }) => ({
            url: "sprints",
            method: "GET",
            params: {
                isPaginationEnabled,
                page,
                pageSize,
                keyword: keyword ? keyword : undefined,
                isActive,
            },
        }),
        providesTags: (result) =>
            result
                ? [
                      ...result.data.result.map((sprint) => ({
                          type: "Sprints" as const,
                          id: sprint.id,
                      })),
                      { type: "Sprints" as const, id: "LIST" },
                  ]
                : [{ type: "Sprints" as const, id: "LIST" }],
    }),

    getSprintById: build.query<Response<ISprintResponse>, { sprintId: number }>(
        {
            query: ({ sprintId }) => ({
                url: `sprints/${sprintId}`,
                method: "GET",
            }),
        }
    ),

    createSprint: build.mutation<Response<ISprintResponse>, ISprintPayload>({
        query: (payload) => ({
            url: "sprints",
            method: "POST",
            body: payload,
        }),
        invalidatesTags: [{ type: "Sprints", id: "LIST" }],
    }),
    updateSprint: build.mutation<
        Response<ISprintResponse>,
        ISprintUpdatePayload
    >({
        query: ({ id, ...payload }) => ({
            url: `sprints/${id}`,
            method: "PUT",
            body: payload,
        }),
        invalidatesTags: (result, error, { id }) => [
            { type: "Sprints", id: id },
            { type: "Sprints", id: "LIST" },
        ],
    }),

    updateSprintStatus: build.mutation<
        Response<ISprintResponse>,
        { sprintId: number; isActive: boolean }
    >({
        query: ({ sprintId, isActive }) => ({
            url: `sprints/${sprintId}/status`,
            method: "PUT",
            body: { isActive },
        }),
        invalidatesTags: (result, error, { sprintId }) => [
            { type: "Sprints", id: sprintId },
            { type: "Sprints", id: "LIST" },
        ],
    }),
});
