import { Request, Response } from "express";

import LabelService from "../services/label.service";

const labelService = new LabelService();

const create = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await labelService.create({
            name: req.body.name,
            description: req.body.description,
            addedBy: req.body.addedBy,
        });

        res.status(201).json({
            success: true,
            data,
            message: "Label created successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: error instanceof Error ? error.message : String(error),
        });
    }
};

const getAll = async (req: Request, res: Response): Promise<void> => {
    const { isActive } = req.query;

    try {
        const data = await labelService.getAll(isActive === "true");

        res.status(200).json({
            success: true,
            data: {
                result: data,
                pagination: {
                    currentPage: 1,
                    pageSize: 10,
                    totalPages: 1,
                },
            },
            message: "Labels fetched successfully",
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
        const data = await labelService.getById(Number(req.params.id));

        res.status(200).json({
            success: true,
            data,
            message: "Label fetched successfully",
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
        const result = await labelService.deactivate(Number(id), isActive);

        res.status(200).json({
            success: true,
            data: result,
            message: `Label marked as ${isActive ? "active" : "inactive"}`,
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
