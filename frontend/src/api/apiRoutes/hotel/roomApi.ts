import type { BaseQueryFn, FetchArgs } from "@reduxjs/toolkit/query/react";
import type {
    EndpointBuilder,
    FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
//
import type {
    IPaginationWithActive,
    Response,
    ResponseWithPagination,
} from "@/types/config.types";
import type {
    IRoomPayload,
    IRoomResponse,
    IRoomUpdatePayload,
} from "@/types/hotel.type";

import type { SerializedError } from "@reduxjs/toolkit";

type TApiConstant = {
    route: string;
    typeTag: string;
};

const apiConstant: TApiConstant = {
    route: "hotels/rooms",
    typeTag: "Rooms",
};

export const roomsEndpoints = (
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
    getRooms: build.query<
        ResponseWithPagination<IRoomResponse[]>,
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
                          type: "Rooms" as const,
                          id: label.id,
                      })),
                      { type: "Rooms" as const, id: "LIST" },
                  ]
                : [{ type: "Rooms" as const, id: "LIST" }],
    }),

    getRoomsById: build.query<Response<IRoomResponse>, { payloadId: number }>({
        query: ({ payloadId }) => ({
            url: `${apiConstant.route}/${payloadId}`,
            method: "GET",
        }),
    }),

    createRooms: build.mutation<Response<IRoomResponse>, IRoomPayload>({
        query: (payload) => ({
            url: apiConstant.route,
            method: "POST",
            body: payload,
        }),
        invalidatesTags: [{ type: "Rooms", id: "LIST" }],
    }),

    updateRooms: build.mutation<Response<IRoomResponse>, IRoomUpdatePayload>({
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

    updateRoomStatus: build.mutation<
        Response<IRoomPayload>,
        { payloadId: number; isActive: boolean }
    >({
        query: ({ payloadId, isActive }) => ({
            url: `${apiConstant.route}/${payloadId}/status`,
            method: "PUT",
            body: { isActive },
        }),
        invalidatesTags: (_result, _error, { payloadId }) => [
            { type: "Rooms", id: payloadId },
            { type: "Rooms", id: "LIST" },
        ],
    }),
});
