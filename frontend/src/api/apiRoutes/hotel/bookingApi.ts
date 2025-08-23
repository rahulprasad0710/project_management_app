import type { BaseQueryFn, FetchArgs } from "@reduxjs/toolkit/query/react";
import type {
    EndpointBuilder,
    FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import type {
    IBookingPagination,
    IBookingPayload,
    IBookingResponse,
    IBookingUpdatePayload,
} from "@/types/hotel.type";
//
import type { Response, ResponseWithPagination } from "@/types/config.types";

import type { SerializedError } from "@reduxjs/toolkit";

type TApiConstant = {
    route: string;
    typeTag: string;
};

const apiConstant: TApiConstant = {
    route: "hotels/bookings",
    typeTag: "Booking",
};

export const bookingEndpoints = (
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
    getBooking: build.query<
        ResponseWithPagination<IBookingResponse[]>,
        IBookingPagination
    >({
        query: ({
            isPaginationEnabled = true,
            page = 1,
            pageSize = 10,
            keyword,
            customerId,
            dateStart,
            dateEnd,
        }) => ({
            url: apiConstant.route,
            method: "GET",
            params: {
                isPaginationEnabled,
                page,
                pageSize,
                keyword,
                customerId,
                dateStart,
                dateEnd,
            },
        }),
        providesTags: (result) =>
            result
                ? [
                      ...result.data.result.map((label) => ({
                          type: "Booking" as const,
                          id: label.id,
                      })),
                      { type: "Booking" as const, id: "LIST" },
                  ]
                : [{ type: "Booking" as const, id: "LIST" }],
    }),

    getBookingById: build.query<
        Response<IBookingResponse>,
        { payloadId: number }
    >({
        query: ({ payloadId }) => ({
            url: `${apiConstant.route}/${payloadId}`,
            method: "GET",
        }),
    }),

    createBooking: build.mutation<Response<IBookingResponse>, IBookingPayload>({
        query: ({ bookingIdemKey, ...payload }) => ({
            url: apiConstant.route,
            method: "POST",
            body: payload,
            headers: {
                bookingIdemKey: bookingIdemKey ?? crypto.randomUUID(),
            },
        }),
        invalidatesTags: [{ type: "Booking", id: "LIST" }],
    }),

    updateBooking: build.mutation<
        Response<IBookingResponse>,
        IBookingUpdatePayload
    >({
        query: ({ id, ...payload }) => ({
            url: `${apiConstant.route}/${id}`,
            method: "PUT",
            body: payload,
        }),
        invalidatesTags: (_result, _error, { id }) => [
            { type: "Booking", id },
            { type: "Booking", id: "LIST" },
        ],
    }),
});
