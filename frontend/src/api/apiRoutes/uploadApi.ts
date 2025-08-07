import type { BaseQueryFn, FetchArgs } from "@reduxjs/toolkit/query/react";
import type {
    EndpointBuilder,
    FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
//
import type {
    IUploadFile,
    Pagination,
    Response,
    ResponseWithPagination,
} from "@/types/config.types";

import type { SerializedError } from "@reduxjs/toolkit";

export const uploadsEndpoints = (
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
    getUploads: build.query<ResponseWithPagination<IUploadFile[]>, Pagination>({
        query: ({
            isPaginationEnabled = false,
            page = 1,
            pageSize = 10,
            keyword,
        }) => ({
            url: `tasks`,
            method: "GET",
            params: {
                isPaginationEnabled,
                page,
                pageSize,
                keyword: keyword ? keyword : undefined,
            },
        }),
        providesTags: (result) =>
            result?.data
                ? result.data.result?.map(({ id }) => ({
                      type: "ProjectTasks" as const,
                      id,
                  }))
                : [{ type: "ProjectTasks" as const }],
    }),
    getUploadsById: build.query<Response<IUploadFile>, { uploadId: number }>({
        query: ({ uploadId }) => ({
            url: `uploads/${uploadId}`,
            method: "GET",
        }),
    }),
    createUploads: build.mutation<Response<IUploadFile>, { files: File[] }>({
        query: (body) => {
            const formData = new FormData();
            body.files.forEach((file: File) => {
                formData.append("file", file);
            });

            return {
                url: "uploads",
                method: "POST",
                body: formData,
                formData: true,
            };
        },
    }),
});
