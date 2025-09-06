import type { BaseQueryFn, FetchArgs } from "@reduxjs/toolkit/query/react";
import type {
    EndpointBuilder,
    FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
//
import type {
    IAuthEmployeePayload,
    IAuthEmployeeResponse,
    IEmployeeResponse,
    IVerifyPayload,
    Response,
} from "@/types/config.types";

import type { SerializedError } from "@reduxjs/toolkit";

type TApiConstant = {
    route: string;
    typeTag: string;
};

const apiConstant: TApiConstant = {
    route: "auth",
    typeTag: "Booking",
};

export const authEndpoints = (
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
    createLoginEmployee: build.mutation<
        Response<IAuthEmployeeResponse>,
        IAuthEmployeePayload
    >({
        query: (payload) => ({
            url: `${apiConstant.route}/login`,
            method: "POST",
            body: payload,
        }),
        invalidatesTags: ["Users"],
    }),

    createVerifyEmail: build.mutation<
        Response<IEmployeeResponse>,
        IVerifyPayload
    >({
        query: (payload) => ({
            url: `${apiConstant.route}/verify-email`,
            method: "POST",
            body: payload,
        }),
    }),
    getUserAuthenticated: build.query<Response<IAuthEmployeeResponse>, void>({
        query: () => ({
            url: `${apiConstant.route}/me`,
            method: "GET",
        }),
    }),
    createRefreshToken: build.mutation<Response<IAuthEmployeeResponse>, void>({
        query: () => ({
            url: `${apiConstant.route}/refresh-token`,
            method: "POST",
            credentials: "include",
        }),
    }),

    getUserLogout: build.query<
        Response<{ id: number; accessToken: null; refreshToken: null }>,
        void
    >({
        query: () => ({
            url: `${apiConstant.route}/logout`,
            method: "GET",
        }),
    }),
});
