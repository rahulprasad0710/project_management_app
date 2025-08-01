import type { BaseQueryFn, FetchArgs } from "@reduxjs/toolkit/query/react";
import type {
    EndpointBuilder,
    FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
//
import type {
    IRolePayload,
    IRoleResponse,
    IRoleUpdatePayload,
    Pagination,
    Response,
    ResponseWithPagination,
} from "@/types/config.types";

import type { SerializedError } from "@reduxjs/toolkit";

export const roleEndpoints = (
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
    getAllRoles: build.query<
        ResponseWithPagination<IRoleResponse[]>,
        Pagination
    >({
        query: ({
            isPaginationEnabled = true,
            page = 1,
            pageSize = 10,
            keyword,
        }) => ({
            url: "roles",
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
                          type: "Labels" as const,
                          id: label.id,
                      })),
                      { type: "Labels" as const, id: "LIST" },
                  ]
                : [{ type: "Labels" as const, id: "LIST" }],
    }),
    getRoleById: build.query<Response<IRoleResponse>, { roleId: number }>({
        query: ({ roleId }) => ({
            url: `roles/${roleId}`,
            method: "GET",
        }),
    }),
    createRoles: build.mutation<Response<IRoleResponse>, IRolePayload>({
        query: (payload) => ({
            url: "labels",
            method: "POST",
            body: payload,
        }),
        invalidatesTags: [{ type: "Labels", id: "LIST" }],
    }),

    updateRole: build.mutation<Response<IRoleResponse>, IRoleUpdatePayload>({
        query: ({ id, ...payload }) => ({
            url: `labels/${id}`,
            method: "PUT",
            body: payload,
        }),
        invalidatesTags: (result, error, { id }) => [
            { type: "Role", id },
            { type: "Role", id: "LIST" },
        ],
    }),

    updateRoleStatus: build.mutation<
        Response<IRoleResponse>,
        { labelId: number; isActive: boolean }
    >({
        query: ({ labelId, isActive }) => ({
            url: `Role/${labelId}/status`,
            method: "PUT",
            body: { isActive },
        }),
        invalidatesTags: (result, error, { labelId }) => [
            { type: "Role", id: labelId },
            { type: "Role", id: "LIST" },
        ],
    }),
});
