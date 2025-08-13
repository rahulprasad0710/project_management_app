import { InternalCompany } from "../../db/entity/InternalCompany";
import { Room } from "../../db/entity/hotel/Room";
import { RoomType } from "../../db/entity/hotel/RoomType";
import dataSource from "../../db/data-source";

export interface IRoom {
    roomNumber: string;
    internal_company: number;
    roomType: RoomType;
}

export class RoomService {
    constructor(
        private readonly roomRepository = dataSource.getRepository(Room),
        private readonly internalCompanyRepository = dataSource.getRepository(
            InternalCompany
        )
    ) {}

    async create(room: IRoom) {
        const roomObj = new Room();

        const internalCompany = await this.internalCompanyRepository.findOneBy({
            id: room.internal_company,
        });

        if (!internalCompany) throw new Error("Internal company not found");

        roomObj.roomNumber = room.roomNumber;
        roomObj.roomType = room.roomType;
        roomObj.internal_company = internalCompany;

        return await this.roomRepository.save(roomObj);
    }

    async getAll() {
        return await this.roomRepository.find({
            relations: ["internal_company", "roomType", "bookingRooms"],
        });
    }

    async getById(id: number) {
        return await this.roomRepository.findOne({
            where: { id },
            relations: ["internal_company", "roomType", "bookingRooms"],
        });
    }

    async update(id: number, updateFields: Partial<IRoom>) {
        const room = await this.roomRepository.findOneBy({ id });
        if (!room) throw new Error("Room not found");

        Object.assign(room, updateFields);
        return await this.roomRepository.save(room);
    }

    async delete(id: number) {
        const room = await this.roomRepository.findOneBy({ id });
        if (!room) throw new Error("Room not found");

        await this.roomRepository.remove(room);
        return { message: "Room deleted successfully" };
    }
}

export default RoomService;
