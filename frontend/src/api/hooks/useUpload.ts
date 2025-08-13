import { api } from "../api";

const {
    useCreateUploadsMutation,
    useGetUploadsQuery,
    useLazyGetUploadsQuery,
    useLazyGetUploadsUrlByIdQuery,
} = api;

export {
    useCreateUploadsMutation,
    useGetUploadsQuery,
    useLazyGetUploadsQuery,
    useLazyGetUploadsUrlByIdQuery,
};
export * from "./useTask";
