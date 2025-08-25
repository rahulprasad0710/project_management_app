import {
    BOOKING_EMAIL,
    BOOKING_LOGS,
    BOOKING_NOTIFICATION,
} from "../../events/bookingEvents";
import { Request, Response } from "express";

import { BookingService } from "../../services/hotel/booking.service";
import { IBookingResponse } from "../../types/payload";
import { IPagination } from "../../types/express";
import { eventBus } from "../../events/eventBus";

const bookingService = new BookingService();

export class BookingController {
    async create(req: Request, res: Response) {
        const bookingIdemKey = req.get("bookingIdemKey");

        const result: IBookingResponse = await bookingService.create({
            checkInDate: req.body.checkInDate,
            checkOutDate: req.body.checkInDate,
            bookingDate: req.body.bookingDate,
            name: req.body.name,
            email: req.body.email,
            mobileNumber: req.body.mobileNumber,
            associated_internal_company_id:
                req.body.associated_internal_company_id,
            roomNumberIds: req.body.roomNumberIds,
            isNewCustomer: req.body.isNewCustomer,
            bookingIdemKey,
            feature_id: req.body.feature_id,
        });

        console.log({
            result: result?.id,
        });

        // 2. Fire side-events

        if (result) {
            // 3. Fire side-events independently
            eventBus.emit(BOOKING_EMAIL, result);
            eventBus.emit(BOOKING_LOGS, result);
            eventBus.emit(BOOKING_NOTIFICATION, { ...result, addedBy: 48 });
        }

        res.status(200).json({
            success: true,
            data: result,
            message: "RoomType created successfully",
        });
    }

    async getAll(req: Request, res: Response) {
        const { dateStart, dateEnd, customerId, bookingDate } = req.query;
        const { skip, take, keyword, isPaginationEnabled }: IPagination =
            req.pagination;
        const result = await bookingService.getAll({
            isPaginationEnabled,
            keyword,
            skip,
            take,
            dateStart: dateStart ? new Date(dateStart as string) : undefined,
            dateEnd: dateEnd ? new Date(dateEnd as string) : undefined,
            bookingDate: bookingDate
                ? new Date(bookingDate as string)
                : undefined,
            customerId: req.query.customerId
                ? Number(req.query.customerId)
                : undefined,
        });

        res.status(200).json({
            success: true,
            data: result,
            message: "RoomType fetched successfully",
        });
    }

    async getById(req: Request, res: Response) {
        const { id } = req.params;
        const result = await bookingService.getById(Number(id));
        res.status(200).json({
            success: true,
            data: result,
            message: "RoomType fetched successfully",
        });
    }
}

export default BookingController;
