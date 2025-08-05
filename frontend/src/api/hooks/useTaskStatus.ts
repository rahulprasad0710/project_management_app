import { api } from "../api";

const {
    useGetAllTaskStatusQuery,
    useGetTaskStatusByIdQuery,
    useLazyGetAllTaskStatusQuery,
} = api;

export {
    useGetAllTaskStatusQuery,
    useGetTaskStatusByIdQuery,
    useLazyGetAllTaskStatusQuery,
};
export * from "./useTaskStatus";
