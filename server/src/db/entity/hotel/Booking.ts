import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";

import { BookingRoom } from "./BookingRoom";
import { Customer } from "../Customer";
import { InternalCompany } from "../InternalCompany";

@Entity()
export class Booking {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    checkInDate: Date;

    @Column()
    checkOutDate: Date;

    @Column()
    status: string;

    @Column()
    payment_status: string;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    totalPrice: number;

    @Column()
    bookingDate: Date;

    @Column()
    customerId: number;

    @ManyToOne(() => Customer, { eager: false })
    @JoinColumn({ name: "customerId" })
    customer: Customer;

    @Column()
    hotelId: number;

    @ManyToOne(() => InternalCompany, (hotel) => hotel.id, {
        eager: false,
    })
    @JoinColumn({ name: "hotelId" })
    hotel: InternalCompany;

    @OneToMany(() => BookingRoom, (bookingRoom) => bookingRoom.booking, {
        cascade: true,
        eager: false,
    })
    bookingRooms: BookingRoom[];
}
