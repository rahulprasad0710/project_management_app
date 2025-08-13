import { api } from "../../api";

const {
    useGetRoomTypesQuery,
    useLazyGetRoomTypesQuery,
    useCreateRoomTypesMutation,
    useUpdateRoomTypesMutation,
    useUpdateRoomTypesStatusMutation,
} = api;

export {
    useGetRoomTypesQuery,
    useCreateRoomTypesMutation,
    useUpdateRoomTypesMutation,
    useUpdateRoomTypesStatusMutation,
    useLazyGetRoomTypesQuery,
};
export * from "./useRoomType";
