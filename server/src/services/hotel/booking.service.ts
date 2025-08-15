import AppError from "../../utils/AppError";
import { Booking } from "../../db/entity/hotel/Booking";
import { BookingRoom } from "../../db/entity/hotel/BookingRoom";
import { CredentialType } from "../../enums/CredentialType";
import { Customer } from "../../db/entity/Customer";
import { ErrorType } from "../../enums/Eums";
import { ICustomerByAdmin } from "../customer.service";
import { Room } from "../../db/entity/hotel/Room";
import dataSource from "../../db/data-source";

interface BookingFullPayload extends BookingPayload {
    bookingIdemKey: string | undefined;
}

interface BookingPayload {
    checkInDate: Date;
    checkOutDate: Date;
    bookingDate: Date;
    name: string;
    email: string;
    mobileNumber: string;
    associated_internal_company_id: number;
    roomNumberIds: number[];
    isNewCustomer: boolean;
}

export class BookingService {
    constructor(
        private readonly bookingRepository = dataSource.getRepository(Booking),
        private readonly bookingRoomRepository = dataSource.getRepository(
            BookingRoom
        )
    ) {}

    async create(fullPayload: BookingFullPayload) {
        const { bookingIdemKey, ...payload } = fullPayload;

        const bookingResult = this.createBooking(payload);

        return bookingResult;
    }

    async createBooking(payload: BookingPayload) {
        const queryRunner = dataSource.createQueryRunner();

        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();

            let totalPrice = 0;
            const roomList: Room[] = [];

            await Promise.all(
                payload.roomNumberIds.map(async (roomId) => {
                    const room = await queryRunner.manager
                        .getRepository(Room)
                        .findOne({
                            where: { id: roomId },
                            relations: ["roomType"],
                        });

                    if (room?.roomType?.roomPrice) {
                        roomList.push(room);
                        totalPrice += Number(room.roomType.roomPrice);
                    }
                })
            );

            // Customer creation under same transaction
            const createCustomer: ICustomerByAdmin = {
                name: payload.name,
                associated_internal_company_id:
                    payload.associated_internal_company_id,
                email: payload.email,
                mobileNumber: payload.mobileNumber,
                CredentialType: CredentialType.ADMIN,
                isActive: true,
                createdAt: new Date(),
            };

            const newCustomerResult = await queryRunner.manager
                .getRepository(Customer)
                .save(createCustomer);

            if (!newCustomerResult) {
                throw new AppError(
                    "User not created.",
                    500,
                    ErrorType.INTERNAL_SERVER_ERROR
                );
            }

            const newBooking = queryRunner.manager.create(Booking, {
                customer: newCustomerResult,
                checkInDate: payload.checkInDate,
                checkOutDate: payload.checkOutDate,
                bookingDate: payload.bookingDate,
                hotelId: payload.associated_internal_company_id,
                status: "CONFIRMED",
                payment_status: "CASH_ON_DELIVERY",
                totalPrice,
            });

            const newBookingResult = await queryRunner.manager
                .getRepository(Booking)
                .save(newBooking);

            const bookedRoomResult = await Promise.all(
                roomList.map(async (room) => {
                    const newBookingRoom = queryRunner.manager.create(
                        BookingRoom,
                        {
                            booking: newBookingResult,
                            room_status: "BOOKED",
                            room,
                        }
                    );

                    return await queryRunner.manager
                        .getRepository(BookingRoom)
                        .save(newBookingRoom);
                })
            );

            await queryRunner.commitTransaction();

            return {
                ...newBookingResult,
                bookedRoomResult,
            };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async getAll() {
        return await this.bookingRepository.find();
    }

    async getById(id: number) {
        return await this.bookingRepository.findOneBy({ id });
    }
}
