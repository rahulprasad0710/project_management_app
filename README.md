# project_management_app

Got it ✅ — you basically want **three core entities** for the hotel booking system in TypeORM, plus a separate `RoomType` table with facilities (enum) and photos.

Here’s a clean relational design:

---

## **Entities in TypeORM**

### 1️⃣ `Hotel`

```ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Room } from "./Room";

@Entity()
export class Hotel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    address: string;

    @OneToMany(() => Room, (room) => room.hotel)
    rooms: Room[];
}
```

---

### 2️⃣ `RoomType`

Here we store name, facilities (enum), and multiple photos.

```ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Room } from "./Room";

export enum Facility {
    WIFI = "Wi-Fi",
    AC = "AC",
    TV = "TV",
    MINI_BAR = "Mini Bar",
    SWIMMING_POOL = "Swimming Pool",
}

@Entity()
export class RoomType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string; // e.g., Duplex, Deluxe, Standard

    @Column("simple-array", { nullable: true })
    photos: string[]; // array of photo URLs

    @Column({
        type: "enum",
        enum: Facility,
        array: true,
        nullable: true,
    })
    facilities: Facility[];

    @OneToMany(() => Room, (room) => room.roomType)
    rooms: Room[];
}
```

---

### 3️⃣ `Room`

A room belongs to a hotel and has a type.

```ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
} from "typeorm";
import { Hotel } from "./Hotel";
import { RoomType } from "./RoomType";
import { BookingRoom } from "./BookingRoom";

@Entity()
export class Room {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    roomNumber: string; // e.g., "401"

    @ManyToOne(() => Hotel, (hotel) => hotel.rooms)
    hotel: Hotel;

    @ManyToOne(() => RoomType, (roomType) => roomType.rooms)
    roomType: RoomType;

    @OneToMany(() => BookingRoom, (bookingRoom) => bookingRoom.room)
    bookingRooms: BookingRoom[];
}
```

---

### 4️⃣ `Booking`

A booking can have multiple rooms.

```ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { BookingRoom } from "./BookingRoom";

@Entity()
export class Booking {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    guestName: string;

    @Column()
    checkInDate: Date;

    @Column()
    checkOutDate: Date;

    @OneToMany(() => BookingRoom, (bookingRoom) => bookingRoom.booking, {
        cascade: true,
    })
    bookingRooms: BookingRoom[];
}
```

---

### 5️⃣ `BookingRoom` (Join Table)

To allow **many rooms per booking**.

```ts
import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
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
}
```

---

### **Relationships Recap**

-   `Hotel` → has many → `Room`
-   `Room` → belongs to → `Hotel`
-   `Room` → has one → `RoomType`
-   `RoomType` → has many → `Room`
-   `Booking` → has many → `BookingRoom` (cascade insert)
-   `BookingRoom` → links → `Booking` & `Room`

---

If you want, I can also add **sample seed data** so you’ll have Duplex/Deluxe rooms with photos and facilities already set up. That would make testing much easier.

Do you want me to prepare that seed file?
