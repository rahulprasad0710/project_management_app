import { api } from "../api";

const {
    useLazyGetTasksQuery,
    useGetTasksByTaskIdQuery,
    useGetTasksByProjectIdQuery,
    useCreateTasksMutation,
    useUpdateTaskStatusMutation,
} = api;

export {
    useLazyGetTasksQuery,
    useGetTasksByTaskIdQuery,
    useGetTasksByProjectIdQuery,
    useCreateTasksMutation,
    useUpdateTaskStatusMutation,
};
export * from "./useTask";
