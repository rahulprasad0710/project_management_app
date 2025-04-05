import { Response, Request, NextFunction } from "express";
import { FindManyOptions } from "typeorm";

const applyPaginationMiddleware = async (
    req: Request,
    _res: Response,
    next: NextFunction
): Promise<void> => {
    const { page, pageSize, keyword, isPaginationEnabled } = req.query;

    const pagination = applyPagination(
        keyword as string,
        page ? Number(page) : undefined,
        pageSize ? Number(pageSize) : undefined,
        isPaginationEnabled === undefined
            ? true
            : isPaginationEnabled === "true"
    );
    req.pagination = pagination;
    next();
};

const applyPagination = <T extends FindManyOptions<T>>(
    keyword?: string,
    page?: number,
    pageSize?: number,
    isPaginationEnabled: boolean = true
): {
    skip?: number;
    take?: number;
    keyword?: string;
    isPaginationEnabled: boolean;
} => {
    if (isPaginationEnabled && page !== undefined && pageSize !== undefined) {
        const skip = (page - 1) * pageSize;
        const take = pageSize;

        return {
            keyword,
            skip,
            take,
            isPaginationEnabled: true,
        };
    } else {
        return {
            keyword,
            skip: undefined,
            take: undefined,
            isPaginationEnabled: false,
        };
    }
};

export default applyPaginationMiddleware;
