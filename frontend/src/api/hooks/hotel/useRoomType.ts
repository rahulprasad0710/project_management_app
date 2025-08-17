import { api } from "../../api";

const {
    useGetRoomTypesQuery,
    useLazyGetRoomTypesQuery,
    useCreateRoomTypesMutation,
    useUpdateRoomTypesMutation,
    useUpdateRoomTypesStatusMutation,
    useLazyGetRoomTypesByIdQuery,
} = api;

export {
    useGetRoomTypesQuery,
    useCreateRoomTypesMutation,
    useUpdateRoomTypesMutation,
    useUpdateRoomTypesStatusMutation,
    useLazyGetRoomTypesQuery,
    useLazyGetRoomTypesByIdQuery,
};
export * from "./useRoomType";
