import { Request, Response } from "express";

import roomAvailabilityService from "../../services/hotel/roomAvailability.service";

export class RoomAvailabilityController {
    async getRoomTypeAvailability(req: Request, res: Response) {
        const { roomTypeId } = req.params;
        const { checkInDate, checkOutDate } = req.query;

        console.log({
            Body: "req.body",
            checkInDate,
            checkOutDate,
        });

        const result = await roomAvailabilityService.getRoomTypeAvailability({
            roomTypeId: Number(roomTypeId),
            checkInDate: checkInDate as string,
            checkOutDate: checkOutDate as string,
        });
        res.status(201).json({
            success: true,
            data: result,
            message: "Room Availability Fetched successfully",
        });
    }
}

export default RoomAvailabilityController;
