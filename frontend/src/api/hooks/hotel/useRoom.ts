import { api } from "../../api";

const {
    useGetRoomsQuery,
    useLazyGetRoomsQuery,
    useCreateRoomsMutation,
    useUpdateRoomsMutation,
    useUpdateRoomStatusMutation,
} = api;

export {
    useGetRoomsQuery,
    useCreateRoomsMutation,
    useUpdateRoomsMutation,
    useUpdateRoomStatusMutation,
    useLazyGetRoomsQuery,
};
export * from "./useRoom";
