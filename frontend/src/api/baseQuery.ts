import type {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import type { IAuthEmployeeResponse, Response } from "../types/config.types";

import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuthToken } from "@/utils/apiFn";
import { setAuthenticateEmployeeDetailsData } from "@/store";

export interface ApiErrorResponse {
    success: boolean; // false in error cases
    data: null; // always null when error
    message: string; // user-facing error message
    type: string; // error type identifier
    devMessage?: string; // optional developer-friendly message
    info?: string; // stack trace or extra debug info
}

// 1. Normal baseQuery
const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/",
    prepareHeaders: async (headers) => {
        const { accessToken } = await getAuthToken();
        if (accessToken) {
            headers.set("authorization", `Bearer ${accessToken}`);
        }
        return headers;
    },
    credentials: "include",
});

// 2. BaseQuery with refresh-token handling
export const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        const errorData = result.error.data as ApiErrorResponse;

        if (errorData?.type === "EXPIRED_TOKEN_ERROR") {
            // Try refresh token API
            const refreshResult = await baseQuery(
                {
                    url: "/auth/refresh-token",
                    method: "POST",
                    credentials: "include",
                },
                api,
                extraOptions
            );

            console.log({
                refreshResult,
            });
            const refreshResultData =
                refreshResult.data as Response<IAuthEmployeeResponse>;

            if (refreshResultData) {
                // Save new token in state
                const newAccessToken = refreshResultData.data.accessToken;
                localStorage.setItem(
                    "accessToken",
                    newAccessToken ? newAccessToken : ""
                );
                api.dispatch(
                    setAuthenticateEmployeeDetailsData({
                        ...refreshResultData.data,
                        accessToken: "BOSS",
                    })
                );

                result = await baseQuery(args, api, extraOptions);
            } else {
                // Refresh failed → logout user
                api.dispatch(setAuthenticateEmployeeDetailsData(null));
            }
        }
    }

    return result;
};

export default baseQueryWithReauth;
