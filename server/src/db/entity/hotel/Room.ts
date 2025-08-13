import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";

import { BookingRoom } from "./BookingRoom";
import { InternalCompany } from "../InternalCompany";
import { RoomType } from "./RoomType";

@Entity()
export class Room {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    roomNumber: string;

    @ManyToOne(() => InternalCompany, (internal_company) => internal_company.id)
    internal_company: InternalCompany;

    @ManyToOne(() => RoomType, (roomType) => roomType.rooms, {
        eager: false,
    })
    roomType: RoomType;

    @OneToMany(() => BookingRoom, (bookingRoom) => bookingRoom.room)
    bookingRooms: BookingRoom[];
}
