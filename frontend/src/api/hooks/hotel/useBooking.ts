import { api } from "../../api";

const {
    useGetBookingQuery,
    useLazyGetBookingQuery,
    useCreateBookingMutation,
    useUpdateBookingMutation,
} = api;

export {
    useGetBookingQuery,
    useLazyGetBookingQuery,
    useCreateBookingMutation,
    useUpdateBookingMutation,
};

export * from "./useBooking";
