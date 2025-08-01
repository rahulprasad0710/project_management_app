import { api } from "../api";

const {
    useGetAllRolesQuery,
    useGetRoleByIdQuery,
    useLazyGetRoleByIdQuery,
    useUpdateRoleMutation,
} = api;

export {
    useGetRoleByIdQuery,
    useUpdateRoleMutation,
    useLazyGetRoleByIdQuery,
    useGetAllRolesQuery,
};
export * from "./useRoles";
