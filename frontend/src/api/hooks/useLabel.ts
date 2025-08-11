import { api } from "../api";

const {
    useGetLabelsQuery,
    useLazyGetLabelsQuery,
    useGetLabelByIdQuery,
    useCreateLabelMutation,
    useUpdateLabelMutation,
    useUpdateLabelStatusMutation,
} = api;

export {
    useGetLabelsQuery,
    useLazyGetLabelsQuery,
    useGetLabelByIdQuery,
    useCreateLabelMutation,
    useUpdateLabelMutation,
    useUpdateLabelStatusMutation,
};
export * from "./useLabel";
