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
    IRoomTypePayload,
    IRoomTypeResponse,
    IRoomTypeUpdatePayload,
} from "@/types/hotel.type";

import type { SerializedError } from "@reduxjs/toolkit";

const roomTypeApiRoute: string = "hotels/room-types";

export const roomTypeEndpoints = (
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
    getRoomTypes: build.query<
        ResponseWithPagination<IRoomTypeResponse[]>,
        IPaginationWithActive
    >({
        query: ({
            isPaginationEnabled = true,
            page = 1,
            pageSize = 10,
            keyword,
            isActive,
        }) => ({
            url: roomTypeApiRoute,
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
                          type: "RoomTypes" as const,
                          id: label.id,
                      })),
                      { type: "RoomTypes" as const, id: "LIST" },
                  ]
                : [{ type: "RoomTypes" as const, id: "LIST" }],
    }),

    getRoomTypesById: build.query<
        Response<IRoomTypeResponse>,
        { roomTypesId: number }
    >({
        query: ({ roomTypesId }) => ({
            url: `${roomTypeApiRoute}/${roomTypesId}`,
            method: "GET",
        }),
    }),

    createRoomTypes: build.mutation<
        Response<IRoomTypeResponse>,
        IRoomTypePayload
    >({
        query: (payload) => ({
            url: roomTypeApiRoute,
            method: "POST",
            body: payload,
        }),
        invalidatesTags: [{ type: "RoomTypes", id: "LIST" }],
    }),

    updateRoomTypes: build.mutation<
        Response<IRoomTypeResponse>,
        IRoomTypeUpdatePayload
    >({
        query: ({ id, ...payload }) => ({
            url: `${roomTypeApiRoute}/${id}`,
            method: "PUT",
            body: payload,
        }),
        invalidatesTags: (result, error, { id }) => [
            { type: "RoomTypes", id },
            { type: "RoomTypes", id: "LIST" },
        ],
    }),

    updateRoomTypesStatus: build.mutation<
        Response<IRoomTypePayload>,
        { roomTypeId: number; isActive: boolean }
    >({
        query: ({ roomTypeId, isActive }) => ({
            url: `${roomTypeApiRoute}/${roomTypeId}/status`,
            method: "PUT",
            body: { isActive },
        }),
        invalidatesTags: (result, error, { roomTypeId }) => [
            { type: "RoomTypes", id: roomTypeId },
            { type: "RoomTypes", id: "LIST" },
        ],
    }),
});
