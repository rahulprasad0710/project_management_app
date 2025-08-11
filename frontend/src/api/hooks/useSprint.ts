import { api } from "../api";

const {
    useGetSprintsQuery,
    useLazyGetSprintsQuery,
    useGetSprintByIdQuery,
    useCreateSprintMutation,
    useUpdateSprintMutation,
    useUpdateSprintStatusMutation,
} = api;

export {
    useGetSprintsQuery,
    useLazyGetSprintsQuery,
    useGetSprintByIdQuery,
    useCreateSprintMutation,
    useUpdateSprintMutation,
    useUpdateSprintStatusMutation,
};
export * from "./useSprint";
