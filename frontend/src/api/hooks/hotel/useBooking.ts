import { api } from "../../api";

const {
    useGetBookingQuery,
    useLazyGetBookingQuery,
    useCreateBookingMutation,
    useUpdateBookingMutation,
    useLazyGetBookingByIdQuery,
} = api;

export {
    useGetBookingQuery,
    useLazyGetBookingQuery,
    useCreateBookingMutation,
    useUpdateBookingMutation,
    useLazyGetBookingByIdQuery,
};

export * from "./useBooking";
