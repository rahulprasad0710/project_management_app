import {
    BOOKING_EMAIL,
    BOOKING_LOGS,
    BOOKING_NOTIFICATION,
} from "../events/bookingEvents";
import { BookingServiceEnum, BookingStatusEnum } from "../enums/BookingEnum";

import { ActionAction } from "../enums/enums";
import { BookingService } from "../services/hotel/booking.service";
import { EmailService } from "../services/config/email.service";
import { IBookingResponse } from "../types/payload";
// subscribers/bookingSubscribers.ts
import { eventBus } from "../events/eventBus";

const bookingService = new BookingService();
const emailService = new EmailService();

// 1. Email subscriber
eventBus.on(BOOKING_EMAIL, async (booking: IBookingResponse) => {
    try {
        const response = emailService.sendBookingConfirmationEmail(booking);
        console.log("LOG: ~ BOOKING_EMAIL response:", response);
        return response;
    } catch (err) {
        console.log("LOG: ~ BOOKING_EMAIL err:", err);
        await bookingService.createBookingServiceFailures({
            bookingId: booking.id,
            error: JSON.stringify(err),
            retry: 0,
            serviceName: BookingServiceEnum.BOOKING_EMAIL,
            status: BookingStatusEnum.FAILED,
        });
    }
});

// 3. Booking logs subscriber
eventBus.on(BOOKING_LOGS, async (booking: IBookingResponse) => {
    try {
        const response = await bookingService.createBookingLog({
            bookingId: booking.id,
            action: ActionAction.CREATED,
            details: JSON.stringify(booking),
            serviceName: BookingServiceEnum.BOOKING_CREATED,
        });
        console.log("LOG: ~ BOOKING_LOGS response:", response);
        return response;
    } catch (err) {
        console.log("LOG: ~ BOOKING_LOGS err:", err);

        await bookingService.createBookingServiceFailures({
            bookingId: booking.id,
            error: JSON.stringify(err),
            retry: 0,
            serviceName: BookingServiceEnum.BOOKING_EMAIL,
            status: BookingStatusEnum.FAILED,
        });
    }
});
