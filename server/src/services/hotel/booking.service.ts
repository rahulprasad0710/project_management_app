import {
    IActivePagination,
    IBookingPagination,
    IRoomPagination,
} from "../../types/payload";
import { ILike, In } from "typeorm";

import AppError from "../../utils/AppError";
import { Booking } from "../../db/entity/hotel/Booking";
import { BookingRoom } from "../../db/entity/hotel/BookingRoom";
import { CredentialType } from "../../enums/CredentialType";
import { Customer } from "../../db/entity/Customer";
import { ErrorType } from "../../enums/Eums";
import { ICustomerByAdmin } from "../customer.service";
import { RedisService } from "./../config/redis.service";
import { Room } from "../../db/entity/hotel/Room";
import createPagination from "../../utils/createPagination";
import dataSource from "../../db/data-source";
import { sanitizeDBResult } from "../../utils/sanitizeDbResult";

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
        private readonly bookingRepository = dataSource.getRepository(Booking)
    ) {}

    async create(fullPayload: BookingFullPayload) {
        const { bookingIdemKey, ...payload } = fullPayload;

        if (!bookingIdemKey || bookingIdemKey === "") {
            throw new AppError(
                "Bad Request. Missing Key.",
                400,
                ErrorType.BAD_REQUEST_ERROR
            );
        } else {
            const alreadyCachedBookingKey = await RedisService.getValue(
                `bookingKey:${bookingIdemKey}`
            );

            if (alreadyCachedBookingKey) {
                const data = JSON.parse(alreadyCachedBookingKey as string);
                return data;
            } else {
                const bookingResult = await this.createBooking(payload);

                await RedisService.setValue(
                    `bookingKey:${bookingIdemKey}`,
                    JSON.stringify(bookingResult)
                );

                return bookingResult;
            }
        }
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

    async getAll(query: IBookingPagination) {
        const {
            skip,
            take,
            isPaginationEnabled,
            dateStart,
            dateEnd,
            customerId,
            bookingDate,
        } = query;

        const [result, totalCount] = await this.bookingRepository.findAndCount({
            skip: skip,
            take: take,
            order: {
                id: "DESC",
            },
            relations: ["customer"],
            where: {
                ...(dateStart ? { checkInDate: dateStart } : {}),
                ...(dateEnd ? { checkOutDate: dateEnd } : {}),
                ...(customerId ? { customerId: customerId } : {}),
                ...(bookingDate ? { bookingDate: bookingDate } : {}),
            },
        });
        return {
            result: result.map((item) => {
                return {
                    ...item,
                    customer: {
                        id: item.customer.id,
                        name: item.customer.name,
                        email: item.customer.email,
                        mobileNumber: item.customer.mobileNumber,
                        associated_internal_company_id:
                            item.customer.associated_internal_company_id,
                    },
                };
            }),
            pagination: createPagination(
                skip,
                take,
                totalCount,
                isPaginationEnabled
            ),
        };
    }

    async getById(id: number) {
        return await this.bookingRepository.findOneBy({ id });
    }
}
