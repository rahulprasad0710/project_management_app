import type { BaseQueryFn, FetchArgs } from "@reduxjs/toolkit/query/react";
import type {
    EndpointBuilder,
    FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

import type { IRoomAvailabilityResponse } from "@/types/hotel.type";
//
import type { Response } from "@/types/config.types";
import type { SerializedError } from "@reduxjs/toolkit";

type TApiConstant = {
    route: string;
    typeTag: string;
};

const apiConstant: TApiConstant = {
    route: "hotels/availability",
    typeTag: "Rooms",
};

export const roomsAvailabilityEndpoints = (
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
    getRoomTypeAvailabilityRoomById: build.query<
        Response<IRoomAvailabilityResponse[]>,
        { roomTypeId: number[]; checkInDate: string; checkOutDate: string }
    >({
        query: ({ roomTypeId, checkInDate, checkOutDate }) => ({
            url: `${apiConstant.route}/room-types`,
            method: "GET",
            params: {
                checkInDate,
                checkOutDate,
                roomTypeId,
            },
        }),
    }),
});
