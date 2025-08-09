import { api } from "../api";

const {
    useGetAllTaskStatusQuery,
    useGetTaskStatusByIdQuery,
    useLazyGetAllTaskStatusQuery,
    useCreateTaskStatusMutation,
    useUpdateTaskStatusMutation,
    useGetTaskStatusByFeatureIdQuery,
    useLazyGetTaskStatusByFeatureIdQuery,
} = api;

export {
    useGetAllTaskStatusQuery,
    useGetTaskStatusByIdQuery,
    useLazyGetAllTaskStatusQuery,
    useCreateTaskStatusMutation,
    useUpdateTaskStatusMutation,
    useGetTaskStatusByFeatureIdQuery,
    useLazyGetTaskStatusByFeatureIdQuery,
};
export * from "./useTaskStatus";
