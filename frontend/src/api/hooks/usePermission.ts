import { api } from "../api";

const {
    useGetAllPermissionGroupsQuery,
    useGetPermissionGroupsDetailsByIdQuery,
    useLazyGetPermissionGroupsDetailsByIdQuery,
} = api;

export {
    useGetAllPermissionGroupsQuery,
    useGetPermissionGroupsDetailsByIdQuery,
    useLazyGetPermissionGroupsDetailsByIdQuery,
};
export * from "./usePermission";
