import type { BaseQueryFn, FetchArgs } from "@reduxjs/toolkit/query/react";
//
import type {
    EmployeePagination,
    IEmployeePayload,
    IEmployeeResponse,
    IEmployeeUpdatePayload,
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
            url: "employees",
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
    getEmployeeView: build.query<
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
            url: "employees/view",
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

    getEmployeesByFeatureId: build.query<
        Response<IEmployeeResponse[]>,
        { featureId: number }
    >({
        query: ({ featureId }) => ({
            url: `employees/feature/${featureId}`,
            method: "GET",
        }),
    }),

    createEmployee: build.mutation<
        Response<IEmployeeResponse>,
        IEmployeePayload
    >({
        query: (payload) => ({
            url: "employees",
            method: "POST",
            body: payload,
        }),
        invalidatesTags: [{ type: "Employees", id: "LIST" }],
    }),
    updateEmployee: build.mutation<
        Response<IEmployeeResponse>,
        IEmployeeUpdatePayload
    >({
        query: (payload) => ({
            url: `employees/${payload.id}`,
            method: "POST",
            body: payload,
        }),
        invalidatesTags: [{ type: "Employees", id: "LIST" }],
    }),
});
