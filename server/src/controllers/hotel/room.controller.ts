import { Request, Response } from "express";
import RoomService, { IRoom } from "../../services/hotel/rooms.service";

const roomService = new RoomService();

export class RoomController {
    async create(req: Request, res: Response) {
        const { roomNumber, internalCompanyId, roomTypeId } = req.body;

        const result = await roomService.create({
            roomNumber,
            internal_company: internalCompanyId,
            roomType: roomTypeId,
        });
        res.status(201).json({
            success: true,
            data: result,
            message: "Room created successfully",
        });
    }

    async getAll(req: Request, res: Response) {
        const result = await roomService.getAll();
        res.status(200).json({
            success: true,
            data: result,
            message: "Room created successfully",
        });
    }

    async getById(req: Request, res: Response) {
        const { id } = req.params;
        const result = await roomService.getById(Number(id));
        res.json({
            success: true,
            data: result,
            message: "Room fetched successfully",
        });
    }

    async update(req: Request, res: Response) {
        const { id } = req.params;
        const { roomNumber, internalCompanyId, roomTypeId } = req.body;

        const updateData: Partial<IRoom> = {
            roomNumber,
            internal_company: internalCompanyId,
            roomType: roomTypeId,
        };

        const result = await roomService.update(Number(id), updateData);

        res.json({
            success: true,
            data: result,
            message: "Room updated successfully",
        });
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params;
        const result = await roomService.delete(Number(id));
        res.json({
            success: true,
            data: result,
            message: "Room deleted successfully",
        });
    }
}

export default new RoomController();
