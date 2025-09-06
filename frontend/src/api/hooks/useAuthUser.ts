import { api } from "../api";

const {
    useLazyGetUserAuthenticatedQuery,
    useLazyGetUserLogoutQuery,
    useCreateLoginEmployeeMutation,
    useCreateVerifyEmailMutation,
    useCreateRefreshTokenMutation,
} = api;

export {
    useLazyGetUserAuthenticatedQuery,
    useCreateLoginEmployeeMutation,
    useCreateVerifyEmailMutation,
    useLazyGetUserLogoutQuery,
    useCreateRefreshTokenMutation,
};
export * from "./useAuthUser";
