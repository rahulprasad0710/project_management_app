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
