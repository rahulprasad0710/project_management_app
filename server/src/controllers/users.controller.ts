import { Request, Response } from "express";

import { IPagination } from "../types/express";
import UserService from "../services/users.service";
import normalizeToString from "../utils/sanatizeQueryParams";

const userService = new UserService();

const create = async (req: Request, res: Response) => {
    const data = req.body;
    const response = await userService.create(data);
    res.status(201).json({
        success: true,
        data: response,
        message: "User created successfully",
    });
};

const getAll = async (req: Request, res: Response) => {
    const rawIsActive = normalizeToString(req.query.isActive);

    const { skip, take, keyword, isPaginationEnabled }: IPagination =
        req.pagination;
    const users = await userService.getAll({
        skip,
        take,
        keyword,
        isPaginationEnabled,
        isActive: rawIsActive === "true" ? true : false,
    });
    res.status(200).json({
        success: true,
        data: users,
        message: "User fetched successfully",
    });
};

export default {
    create,
    getAll,
};
