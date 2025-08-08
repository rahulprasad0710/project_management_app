import { api } from "../api";

const {
    useGetCommentsByTaskIdQuery,
    useLazyGetCommentsByTaskIdQuery,
    useLazyGetActivityByTaskIdQuery,
    useCreateCommentMutation,
    useUpdateCommentMutation,
    useDeleteCommentMutation,
    useGetActivityByTaskIdQuery,
} = api;

export {
    useGetCommentsByTaskIdQuery,
    useLazyGetActivityByTaskIdQuery,
    useCreateCommentMutation,
    useUpdateCommentMutation,
    useDeleteCommentMutation,
    useGetActivityByTaskIdQuery,
    useLazyGetCommentsByTaskIdQuery,
};
export * from "./useComment";
