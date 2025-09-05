import { api } from "../api";

const {
    useLazyGetUserAuthenticatedQuery,
    useLazyGetUserLogoutQuery,
    useCreateLoginEmployeeMutation,
    useCreateVerifyEmailMutation,
} = api;

export {
    useLazyGetUserAuthenticatedQuery,
    useCreateLoginEmployeeMutation,
    useCreateVerifyEmailMutation,
    useLazyGetUserLogoutQuery,
};
export * from "./useAuthUser";
