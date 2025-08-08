import { api } from "../api";

const {
    useLazyGetTasksQuery,
    useGetTasksByTaskIdQuery,
    useGetTasksByProjectIdQuery,
    useCreateTasksMutation,
    useUpdateTaskStatusMutation,
    useLazyGetTasksByTaskIdQuery,
} = api;

export {
    useLazyGetTasksQuery,
    useGetTasksByTaskIdQuery,
    useGetTasksByProjectIdQuery,
    useCreateTasksMutation,
    useUpdateTaskStatusMutation,
    useLazyGetTasksByTaskIdQuery,
};
export * from "./useTask";
