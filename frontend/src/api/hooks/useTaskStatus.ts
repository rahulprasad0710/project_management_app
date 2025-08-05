import { api } from "../api";

const {
    useGetAllTaskStatusQuery,
    useGetTaskStatusByIdQuery,
    useLazyGetAllTaskStatusQuery,
    useCreateTaskStatusMutation,
    useUpdateTaskStatusMutation,
} = api;

export {
    useGetAllTaskStatusQuery,
    useGetTaskStatusByIdQuery,
    useLazyGetAllTaskStatusQuery,
    useCreateTaskStatusMutation,
    useUpdateTaskStatusMutation,
};
export * from "./useTaskStatus";
