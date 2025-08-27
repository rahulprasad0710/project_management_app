import { Request, Response } from "express";

import FeatureService from "../services/feature.service";
import { IPagination } from "../types/express";
import normalizeToString from "../utils/sanatizeQueryParams";

const featureService = new FeatureService();

const getById = async (req: Request, res: Response) => {
    const featureId = Number(req.params.id);

    const taskStatus = await featureService.getById(featureId);

    res.status(200).json({
        success: true,
        data: taskStatus,
        message: "Task status fetched successfully",
    });
};

const getAll = async (req: Request, res: Response) => {
    const { skip, take, keyword, isPaginationEnabled }: IPagination =
        req.pagination;
    const isActive = normalizeToString(req.query.isActive);

    const taskStatus = await featureService.getAll({
        skip,
        take,
        keyword,
        isPaginationEnabled,
        isActive: isActive === "true",
    });

    res.status(200).json({
        success: true,
        data: taskStatus,
        message: "Task status fetched successfully",
    });
};

export default {
    getById,
    getAll,
};
