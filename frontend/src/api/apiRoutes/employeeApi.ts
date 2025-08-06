import type { BaseQueryFn, FetchArgs } from "@reduxjs/toolkit/query/react";
//
import type {
    EmployeePagination,
    IEmployeePayload,
    IEmployeeResponse,
    Response,
    ResponseWithPagination,
} from "@/types/config.types";
import type {
    EndpointBuilder,
    FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

import type { SerializedError } from "@reduxjs/toolkit";

export const employeeEndpoints = (
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
    getEmployees: build.query<
        ResponseWithPagination<IEmployeeResponse[]>,
        EmployeePagination
    >({
        query: ({
            isPaginationEnabled = true,
            page = 1,
            pageSize = 10,
            keyword,
            isActive,
        }) => ({
            url: "users",
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
                      ...result.data.result.map((employee) => ({
                          type: "Employees" as const,
                          id: employee.id,
                      })),
                      { type: "Employees" as const, id: "LIST" },
                  ]
                : [{ type: "Employees" as const, id: "LIST" }],
    }),

    getEmployeeById: build.query<
        Response<IEmployeeResponse>,
        { employeeId: number }
    >({
        query: ({ employeeId }) => ({
            url: `users/${employeeId}`,
            method: "GET",
        }),
    }),

    createEmployee: build.mutation<
        Response<IEmployeeResponse>,
        IEmployeePayload
    >({
        query: (payload) => ({
            url: "users",
            method: "POST",
            body: payload,
        }),
        invalidatesTags: [{ type: "Employees", id: "LIST" }],
    }),
});
