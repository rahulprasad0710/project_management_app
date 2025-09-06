import type {
    IPaginationWithActive,
    IPermissionGroupResponse,
    Response,
    ResponseWithPagination,
} from "../types/config.types";

import { authEndpoints } from "./apiRoutes/authApi";
import { baseQueryWithReauth } from "./baseQuery";
import { bookingEndpoints } from "./apiRoutes/hotel/bookingApi";
import { commentEndpoints } from "./apiRoutes/commentApi";
import { createApi } from "@reduxjs/toolkit/query/react";
import { customerEndpoints } from "./apiRoutes/customerApi";
import { employeeEndpoints } from "./apiRoutes/employeeApi";
import { featuresEndpoints } from "./apiRoutes/featureApi";
import { internalCompanyEndpoints } from "./apiRoutes/internalCompanyApi";
import { labelEndpoints } from "./apiRoutes/labelApi";
import { projectEndpoints } from "./apiRoutes/projectApi";
import { roleEndpoints } from "./apiRoutes/rolesApi";
import { roomTypeEndpoints } from "./apiRoutes/hotel/roomTypeApi";
import { roomsAvailabilityEndpoints } from "./apiRoutes/hotel/roomsAvailabilityApi";
import { roomsEndpoints } from "./apiRoutes/hotel/roomApi";
import { sprintEndpoints } from "./apiRoutes/sprintApi";
import { taskEndpoints } from "./apiRoutes/taskApi";
import { taskStatusEndpoints } from "./apiRoutes/taskStatusApi";
import { uploadsEndpoints } from "./apiRoutes/uploadApi";

// /* REDUX API */

export const api = createApi({
    baseQuery: baseQueryWithReauth,
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
        // hotel
        "RoomTypes",
        "Room",
        "Booking",
        "RoomAvailability",
        "AuthUser",
    ],
    endpoints: (build) => ({
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

        ...authEndpoints(build),
        ...internalCompanyEndpoints(build),
        ...roleEndpoints(build),
        ...taskStatusEndpoints(build),
        ...taskEndpoints(build),
        ...employeeEndpoints(build),
        ...labelEndpoints(build),
        ...uploadsEndpoints(build),
        ...sprintEndpoints(build),
        ...commentEndpoints(build),
        // hotel API
        ...roomTypeEndpoints(build),
        ...roomsEndpoints(build),
        ...bookingEndpoints(build),
        ...customerEndpoints(build),
        ...roomsAvailabilityEndpoints(build),
        ...projectEndpoints(build),
        ...featuresEndpoints(build),
    }),
});

export const {
    // PERMISSIONS
    useGetAllPermissionGroupsQuery,
    useLazyGetPermissionGroupsDetailsByIdQuery,
    // ROLES
} = api;
