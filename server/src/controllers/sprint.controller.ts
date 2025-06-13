import { Request, Response } from "express";

import SprintService from "../services/sprint.service";

const sprintService = new SprintService();

const create = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await sprintService.create({
            name: req.body.name,
            goal: req.body.goal,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            addedBy: req.body.addedBy,
        });

        res.status(201).json({
            success: true,
            data,
            message: "Sprint created successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: error instanceof Error ? error.message : String(error),
        });
    }
};

const getAll = async (_req: Request, res: Response): Promise<void> => {
    const { isActive } = _req.query; // isActive is a string
    try {
        const data = await sprintService.getAll(
            isActive === "true" ? true : false
        );

        res.status(200).json({
            success: true,
            data,
            message: "Sprints fetched successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: error instanceof Error ? error.message : String(error),
        });
    }
};

const getById = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await sprintService.getById(Number(req.params.id));

        res.status(200).json({
            success: true,
            data,
            message: "Sprint fetched successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: error instanceof Error ? error.message : String(error),
        });
    }
};

const updateStatus = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { isActive } = req.body;

    try {
        const result = await sprintService.deactivate(Number(id), isActive);

        res.status(200).json({
            success: true,
            data: result,
            message: `Sprint marked as ${isActive ? "active" : "inactive"}`,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: error instanceof Error ? error.message : String(error),
        });
    }
};

export default {
    create,
    getAll,
    getById,
    updateStatus,
};
