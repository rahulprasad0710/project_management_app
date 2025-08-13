import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Booking } from "./Booking";
import { Room } from "./Room";

@Entity()
export class BookingRoom {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Booking, (booking) => booking.bookingRooms)
    booking: Booking;

    @ManyToOne(() => Room, (room) => room.bookingRooms)
    room: Room;

    @Column()
    room_status: string;
}
