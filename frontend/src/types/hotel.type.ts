import type { Pagination } from "./config.types";

export interface IRoomTypePayload {
    name: string;
    facilities?: string[];
    roomPrice: number;
    total_number_of_rooms: number;
    thumbnailUrl: string;
    description: string;
    isActive: boolean;
}

export interface IRoomTypeUpdatePayload extends IRoomTypePayload {
    id: number;
}

export interface IRoomUpdatePayload extends IRoomPayload {
    id: number;
}
export interface IRoomTypeResponse {
    id: number;
    name: string;
    facilities: string[];
    roomPrice: number;
    total_number_of_rooms: number;
    thumbnailUrl: string;
    description: string;
    isActive: boolean;
    thumbnailUrlId: string;
    rooms: IRoomResponse[];
}

export interface IRoomPayload {
    roomNumber: string;
    internalCompanyId: number;
    roomTypeId: number;
    isActive: boolean;
}

export interface IRoomResponse {
    id: number;
    roomNumber: string;
    internal_company_id: number;
    roomTypeId: number;
    isActive: boolean;
    roomType: IRoomTypeResponse;
}

export interface IRoomAvailabilityResponse {
    roomIdList: number[];
    roomTypeId: number;
}

export type IBookingPayload =
    | {
          checkInDate: Date;
          checkOutDate: Date;
          bookingDate: Date;
          associated_internal_company_id: number;
          roomNumberIds: number[];
          isNewCustomer: true;
          // required if new customer
          name: string;
          email: string;
          mobileNumber: string;
          bookingIdemKey: string;
      }
    | {
          checkInDate: Date;
          checkOutDate: Date;
          bookingDate: Date;
          associated_internal_company_id: number;
          roomNumberIds: number[];
          isNewCustomer: false;
          // required if existing customer
          customerId: number;
          bookingIdemKey: string;
      };

export type IBookingUpdatePayload =
    | (Extract<IBookingPayload, { isNewCustomer: true }> & { id: number })
    | (Extract<IBookingPayload, { isNewCustomer: false }> & { id: number });

export interface IBookingPagination extends Pagination {
    dateStart?: Date;
    dateEnd?: Date;
    customerId?: number;
}

export interface IBookingResponse {
    id: number;
    bookingId: string;
    checkInDate: Date;
    checkOutDate: Date;
    bookingDate: Date;
    totalPrice: string;
    status: string;
    payment_status: string;
    customer: Partial<ICustomerResponse>;
    hotelId: number;
    customerId: number;
}

export interface ICustomerResponse {
    createdAt: string; // ISO date string
    isActive: boolean;
    id: number;
    name: string;
    email: string;
    mobileNumber: string;
    CredentialType: "ADMIN" | "USER" | "SUPER_ADMIN"; // extend if needed
    associated_internal_company_id: number;
    profilePictureUrl: string | null;
    emailVerified: boolean;
}
