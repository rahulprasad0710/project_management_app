import { Request, Response } from "express";

import FeatureService from "../services/feature.service";

const featureService = new FeatureService();

const getTaskStatusByFeatureId = async (req: Request, res: Response) => {
    const featureId = Number(req.params.id);

    const taskStatus = await featureService.getTaskStatusByFeatureId(featureId);

    res.status(200).json({
        success: true,
        data: taskStatus,
        message: "Task status fetched successfully",
    });
};

export default {
    getTaskStatusByFeatureId,
};
