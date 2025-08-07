import { api } from "../api";

const {
    useCreateUploadsMutation,
    useGetUploadsQuery,
    useLazyGetUploadsQuery,
    useGetUploadsByIdQuery,
} = api;

export {
    useCreateUploadsMutation,
    useGetUploadsQuery,
    useLazyGetUploadsQuery,
    useGetUploadsByIdQuery,
};
export * from "./useTask";
