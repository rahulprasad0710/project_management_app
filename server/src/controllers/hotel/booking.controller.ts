import { Request, Response } from "express";

import { BookingService } from "../../services/hotel/booking.service";
import { IPagination } from "../../types/express";

const bookingService = new BookingService();

export class BookingController {
    async create(req: Request, res: Response) {
        const bookingIdemKey = req.get("bookingIdemKey");

        const result = await bookingService.create({
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
        });
        res.status(200).json({
            success: true,
            data: result,
            message: "RoomType created successfully",
        });
    }

    async getAll(req: Request, res: Response) {
        const { isActive } = req.query;
        const { skip, take, keyword, isPaginationEnabled }: IPagination =
            req.pagination;
        // const result = await bookingService.getAll({
        //     isActive: isActive === "true",
        //     isPaginationEnabled,
        //     keyword,
        //     skip,
        //     take,
        // });

        const result = await bookingService.getAll();
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
