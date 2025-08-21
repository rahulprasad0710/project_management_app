import { api } from "../api";

const {
    useCreateProjectMutation,
    useCreateUploadsMutation,
    useLazyGetProjectByIdQuery,
    useUpdateProjectMutation,
    useLazyGetProjectsQuery,
} = api;

export {
    useCreateProjectMutation,
    useCreateUploadsMutation,
    useLazyGetProjectByIdQuery,
    useUpdateProjectMutation,
    useLazyGetProjectsQuery,
};
export * from "./useComment";
