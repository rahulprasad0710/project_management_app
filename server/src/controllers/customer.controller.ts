import { Request, Response } from "express";

import { CustomerService } from "../services/customer.service";
import { IPagination } from "../types/express";

const customerService = new CustomerService();

const getAll = async (req: Request, res: Response): Promise<void> => {
    const { isActive } = req.query;
    const { skip, take, keyword, isPaginationEnabled }: IPagination =
        req.pagination;

    const data = await customerService.getAll({
        isActive: isActive === "true",
        isPaginationEnabled,
        keyword,
        skip,
        take,
    });

    res.status(200).json({
        success: true,
        data: data,
        message: "Customer fetched successfully",
    });
};

export default {
    getAll,
};
