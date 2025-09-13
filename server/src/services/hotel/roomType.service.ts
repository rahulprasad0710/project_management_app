import { Facility } from "../../enums/Facility";
import { IActivePagination } from "../../types/payload";
import { ILike } from "typeorm";
import { RoomType } from "../../db/entity/hotel/RoomType";
import { UploadFile } from "../../db/entity/uploads";
import createPagination from "../../utils/createPagination";
import dataSource from "../../db/data-source";
import { sanitizeDBResult } from "../../utils/sanitizeDbResult";

interface IRoomType {
    name: string;
    facilities?: Facility[];
    roomPrice: number;
    total_number_of_rooms: number;
    thumbnailUrl: string;
    isActive: boolean;
    description: string;
}

export class RoomTypeService {
    private readonly roomTypeRepository = dataSource.getRepository(RoomType);
    private readonly uploadRepository = dataSource.getRepository(UploadFile);

    async create(roomType: IRoomType) {
        const roomTypeObj = new RoomType();
        roomTypeObj.name = roomType.name;
        roomTypeObj.facilities = roomType.facilities || [];
        roomTypeObj.roomPrice = roomType.roomPrice;
        roomTypeObj.total_number_of_rooms = roomType.total_number_of_rooms;
        roomTypeObj.isActive = roomType.isActive;
        roomTypeObj.description = roomType.description;

        const uploadFile = await this.uploadRepository.findOne({
            where: { id: roomType.thumbnailUrl },
        });
        if (uploadFile) {
            roomTypeObj.thumbnailUrl = uploadFile;
        }

        const result = await this.roomTypeRepository.save(roomTypeObj);

        return result;
    }

    async getAll(query: IActivePagination) {
        const { skip, take, isPaginationEnabled, keyword, isActive } = query;

        const result = await this.roomTypeRepository.find({
            skip,
            take,
            select: [
                "id",
                "name",
                "description",
                "isActive",
                "thumbnailUrlId",
                "roomPrice",
                "total_number_of_rooms",
                "facilities",
            ],
            relations: ["rooms"],
            where: {
                ...{ isActive: isActive },
                ...(keyword ? { name: ILike(`%${keyword}%`) } : {}),
            },
        });

        const sanitizeResult = result?.map((item) => {
            return {
                ...item,
                rooms: sanitizeDBResult({
                    result: item.rooms,
                    selectFields: ["id", "roomNumber"],
                }),
            };
        });

        return {
            result: sanitizeResult,
            pagination: createPagination(
                skip,
                take,
                result.length,
                isPaginationEnabled
            ),
        };
    }

    async getById(id: number) {
        const result = await this.roomTypeRepository.findOne({
            where: { id },
            relations: ["rooms"],
        });

        return {
            ...result,
            rooms: result?.rooms?.map((room) => {
                return {
                    id: room.id,
                    roomNumber: room.roomNumber,
                    isActive: room.isActive,
                };
            }),
        };
    }

    async update(id: number, updateFields: Partial<IRoomType>) {
        const roomType = await this.roomTypeRepository.findOneBy({ id });
        if (!roomType) throw new Error("RoomType not found");

        Object.assign(roomType, updateFields);
        return await this.roomTypeRepository.save(roomType);
    }

    async delete(id: number) {
        const roomType = await this.roomTypeRepository.findOneBy({ id });
        if (!roomType) throw new Error("RoomType not found");

        await this.roomTypeRepository.remove(roomType);
        return { message: "RoomType deleted successfully" };
    }
}

export default RoomTypeService;
