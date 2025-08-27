import type { BaseQueryFn, FetchArgs } from "@reduxjs/toolkit/query/react";
import type {
    EndpointBuilder,
    FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
//
import type {
    IFeatureDetailsResponse,
    IFeaturePayload,
    IFeatureResponse,
    IFeatureUpdatePayload,
    IPaginationWithActive,
    Response,
    ResponseWithPagination,
} from "@/types/config.types";

import type { SerializedError } from "@reduxjs/toolkit";

type TApiConstant = {
    route: string;
    typeTag: string;
};

const apiConstant: TApiConstant = {
    route: "features",
    typeTag: "Features",
};

export const featuresEndpoints = (
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
    getFeatures: build.query<
        ResponseWithPagination<IFeatureResponse[]>,
        IPaginationWithActive
    >({
        query: ({
            isPaginationEnabled = true,
            page = 1,
            pageSize = 10,
            keyword,
            isActive,
        }) => ({
            url: apiConstant.route,
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
                          type: "Features" as const,
                          id: label.id,
                      })),
                      { type: "Features" as const, id: "LIST" },
                  ]
                : [{ type: "Features" as const, id: "LIST" }],
    }),

    getFeaturesById: build.query<
        Response<IFeatureDetailsResponse>,
        { payloadId: number }
    >({
        query: ({ payloadId }) => ({
            url: `${apiConstant.route}/${payloadId}`,
            method: "GET",
        }),
    }),

    createFeatures: build.mutation<
        Response<IFeatureDetailsResponse>,
        IFeaturePayload
    >({
        query: (payload) => ({
            url: apiConstant.route,
            method: "POST",
            body: payload,
        }),
        invalidatesTags: [{ type: "Features", id: "LIST" }],
    }),

    updateFeatures: build.mutation<
        Response<IFeatureDetailsResponse>,
        IFeatureUpdatePayload
    >({
        query: ({ id, ...payload }) => ({
            url: `${apiConstant.route}/${id}`,
            method: "PUT",
            body: payload,
        }),
        invalidatesTags: (_result, _error, { id }) => [
            { type: "Rooms", id },
            { type: "Rooms", id: "LIST" },
        ],
    }),

    updateFeaturesStatus: build.mutation<
        Response<IFeatureUpdatePayload>,
        { payloadId: number; isActive: boolean }
    >({
        query: ({ payloadId, isActive }) => ({
            url: `${apiConstant.route}/${payloadId}/status`,
            method: "PUT",
            body: { isActive },
        }),
        invalidatesTags: (_result, _error, { payloadId }) => [
            { type: "Features", id: payloadId },
            { type: "Features", id: "LIST" },
        ],
    }),
});
