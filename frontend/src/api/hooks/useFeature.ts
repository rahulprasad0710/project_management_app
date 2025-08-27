import { api } from "../api";

const {
    useGetFeaturesQuery,
    useCreateFeaturesMutation,
    useUpdateFeaturesMutation,
    useLazyGetFeaturesQuery,
    useLazyGetFeaturesByIdQuery,
} = api;

export {
    useGetFeaturesQuery,
    useCreateFeaturesMutation,
    useUpdateFeaturesMutation,
    useLazyGetFeaturesQuery,
    useLazyGetFeaturesByIdQuery,
};
export * from "./useFeature";
