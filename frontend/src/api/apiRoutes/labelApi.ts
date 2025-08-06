import type { BaseQueryFn, FetchArgs } from "@reduxjs/toolkit/query/react";
import type {
    EndpointBuilder,
    FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
//
import type {
    ILabelPayload,
    ILabelResponse,
    ILabelUpdatePayload,
    LabelPagination,
    Response,
    ResponseWithPagination,
} from "@/types/config.types";

import type { SerializedError } from "@reduxjs/toolkit";

export const labelEndpoints = (
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
    getLabels: build.query<
        ResponseWithPagination<ILabelResponse[]>,
        LabelPagination
    >({
        query: ({
            isPaginationEnabled = true,
            page = 1,
            pageSize = 10,
            keyword,
            isActive,
        }) => ({
            url: "labels",
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
                      ...result.data.result.map((label) => ({
                          type: "Labels" as const,
                          id: label.id,
                      })),
                      { type: "Labels" as const, id: "LIST" },
                  ]
                : [{ type: "Labels" as const, id: "LIST" }],
    }),

    getLabelById: build.query<Response<ILabelResponse>, { labelId: number }>({
        query: ({ labelId }) => ({
            url: `labels/${labelId}`,
            method: "GET",
        }),
    }),

    createLabel: build.mutation<Response<ILabelResponse>, ILabelPayload>({
        query: (payload) => ({
            url: "labels",
            method: "POST",
            body: payload,
        }),
        invalidatesTags: [{ type: "Labels", id: "LIST" }],
    }),

    updateLabel: build.mutation<Response<ILabelResponse>, ILabelUpdatePayload>({
        query: ({ id, ...payload }) => ({
            url: `labels/${id}`,
            method: "PUT",
            body: payload,
        }),
        invalidatesTags: (result, error, { id }) => [
            { type: "Labels", id },
            { type: "Labels", id: "LIST" },
        ],
    }),

    updateLabelStatus: build.mutation<
        Response<ILabelResponse>,
        { labelId: number; isActive: boolean }
    >({
        query: ({ labelId, isActive }) => ({
            url: `labels/${labelId}/status`,
            method: "PUT",
            body: { isActive },
        }),
        invalidatesTags: (result, error, { labelId }) => [
            { type: "Labels", id: labelId },
            { type: "Labels", id: "LIST" },
        ],
    }),
});
