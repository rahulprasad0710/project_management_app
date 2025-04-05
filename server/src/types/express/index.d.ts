declare global {
    namespace Express {
        interface Request {
            pagination: IPagination;
        }
    }
}

export interface IPagination {
    skip?: number;
    take?: number;
    keyword?: string;
    isPaginationEnabled: boolean | undefined;
}
