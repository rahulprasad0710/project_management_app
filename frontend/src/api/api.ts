import type {
    IAuthEmployeePayload,
    IAuthEmployeeResponse,
    IEmployeeResponse,
    IPaginationWithActive,
    IPermissionGroupResponse,
    IVerifyPayload,
    Response,
    ResponseWithPagination,
} from "../types/config.types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { commentEndpoints } from "./apiRoutes/commentApi";
import { employeeEndpoints } from "./apiRoutes/employeeApi";
import { labelEndpoints } from "./apiRoutes/labelApi";
import { roleEndpoints } from "./apiRoutes/rolesApi";
import { sprintEndpoints } from "./apiRoutes/sprintApi";
import { taskEndpoints } from "./apiRoutes/taskApi";
import { taskStatusEndpoints } from "./apiRoutes/taskStatusApi";
import { uploadsEndpoints } from "./apiRoutes/uploadApi";

// /* REDUX API */

async function getAuthToken(): Promise<{ accessToken: string }> {
    // Example: get token from localStorage or cookies
    const accessToken = localStorage.getItem("accessToken") || "";
    return { accessToken };
}

export const api = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8000/api/",
        credentials: "include",
        prepareHeaders: async (headers) => {
            const { accessToken } = await getAuthToken();
            console.log("LOG: ~ prepareHeaders: ~ accessToken:", accessToken);
            headers.set("Authorization", `Bearer ${accessToken}`);
            return headers;
        },
    }),
    reducerPath: "api",
    tagTypes: [
        "Users",
        "Projects",
        "Tasks",
        "Sprints",
        "Labels",
        "Comments",
        "Activity",
        "ProjectTasks",
        "Employees",
        "InternalCompany",
        "PermissionGroup",
        "Role",
        "TaskStatus",
    ],
    endpoints: (build) => ({
        createLoginEmployee: build.mutation<
            Response<IAuthEmployeeResponse>,
            IAuthEmployeePayload
        >({
            query: (payload) => ({
                url: "auth/login",
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
                url: "auth/verify-email",
                method: "POST",
                body: payload,
            }),
        }),

        // ! PERMISSION-GROUP-STARTS
        getAllPermissionGroups: build.query<
            ResponseWithPagination<IPermissionGroupResponse[]>,
            IPaginationWithActive
        >({
            query: ({
                isPaginationEnabled = true,
                page = 1,
                pageSize = 10,
                keyword,
                isActive,
            }) => ({
                url: "permissions/groups",
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
                          ...result.data.result.map((item) => ({
                              type: "PermissionGroup" as const,
                              id: item.id,
                          })),
                          { type: "PermissionGroup" as const, id: "LIST" },
                      ]
                    : [{ type: "PermissionGroup" as const, id: "LIST" }],
        }),

        getPermissionGroupsDetailsById: build.query<
            Response<IPermissionGroupResponse>,
            { permissionGroupId: number }
        >({
            query: ({ permissionGroupId }) => ({
                url: `permissions/groups/${permissionGroupId}`,
                method: "GET",
            }),
        }),

        // ! ROLES-STARTS
        ...roleEndpoints(build),
        ...taskStatusEndpoints(build),
        ...taskEndpoints(build),
        ...employeeEndpoints(build),
        ...labelEndpoints(build),
        ...uploadsEndpoints(build),
        ...sprintEndpoints(build),
        ...commentEndpoints(build),
    }),
});

export const {
    useCreateLoginEmployeeMutation,

    useCreateEmployeeMutation,
    //AUTH
    useCreateVerifyEmailMutation,
    // PERMISSIONS
    useGetAllPermissionGroupsQuery,
    useLazyGetPermissionGroupsDetailsByIdQuery,
    // ROLES
} = api;
