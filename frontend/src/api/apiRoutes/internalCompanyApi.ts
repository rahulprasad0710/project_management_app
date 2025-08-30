import type { BaseQueryFn, FetchArgs } from "@reduxjs/toolkit/query/react";
import type {
    EndpointBuilder,
    FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
//
import type {
    IInternalCompanyResponse,
    IInternalCompanyUpdatePayload,
    ILabelPayload,
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
    route: "internal-companies",
    typeTag: "Rooms",
};

export const internalCompanyEndpoints = (
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
    // ! INTERNAL COMPANY-STARTS
    getInternalCompanies: build.query<
        ResponseWithPagination<IInternalCompanyResponse[]>,
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
    }),

    getInternalCompanyById: build.query<
        Response<IInternalCompanyResponse>,
        { internalCompanyId: number }
    >({
        query: ({ internalCompanyId }) => ({
            url: `internal-companies/${internalCompanyId}`,
            method: "GET",
        }),
    }),

    createInternalCompany: build.mutation<
        Response<IInternalCompanyResponse>,
        ILabelPayload
    >({
        query: (payload) => ({
            url: "internal-companies",
            method: "POST",
            body: payload,
        }),
        invalidatesTags: [{ type: "InternalCompany", id: "LIST" }],
    }),

    updateInternalCompany: build.mutation<
        Response<IInternalCompanyResponse>,
        IInternalCompanyUpdatePayload
    >({
        query: ({ id, ...payload }) => ({
            url: `internal-companies/${id}`,
            method: "PUT",
            body: payload,
        }),
        invalidatesTags: (result, error, { id }) => [
            { type: "InternalCompany", id },
            { type: "InternalCompany", id: "LIST" },
        ],
    }),

    updateInternalCompanyStatus: build.mutation<
        Response<IInternalCompanyResponse>,
        { internalCompanyId: number; isActive: boolean }
    >({
        query: ({ internalCompanyId, isActive }) => ({
            url: `internal-companies/${internalCompanyId}/status`,
            method: "PUT",
            body: { isActive },
        }),
        invalidatesTags: (result, error, { internalCompanyId }) => [
            { type: "InternalCompany", id: internalCompanyId },
            { type: "InternalCompany", id: "LIST" },
        ],
    }),
});
