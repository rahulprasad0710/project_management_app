import TaskService from "../services/task.service";
const taskService = new TaskService();
import { Request, Response } from "express";
import { IPagination } from "../types/express";
import { TaskStatus } from "../enums/Priority";

const create = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await taskService.create({
            title: req.body.title,
            description: req.body.description,
            priority: req.body.priority,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            addedBy: req.body.addedBy,
            project: req.body.projectId,
            status: req.body.status,
        });
        res.status(201).json({
            success: true,
            data: data,
            message: "Task created successfully",
        });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

const getAll = async (req: Request, res: Response): Promise<void> => {
    try {
        const { skip, take, keyword, isPaginationEnabled }: IPagination =
            req.pagination;
        const users = await taskService.getAll({
            skip,
            take,
            keyword,
            isPaginationEnabled,
        });
        res.status(200).json({
            success: true,
            data: users,
            message: "Task fetched successfully",
        });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

const getById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const users = await taskService.getById(Number(id));
        res.status(200).json({
            success: true,
            data: users,
            message: "Task fetched successfully",
        });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

const updateStatus = async (req: Request, res: Response): Promise<void> => {
    const { taskId } = req.params;

    const { status } = req.body;

    try {
        const response = await taskService.updateStatus(
            parseInt(taskId),
            status
        );
        res.status(200).json({
            success: true,
            data: response,
            message: "Task Updated successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: error,
            success: false,
            data: null,
        });
    }
};

export default {
    create,
    getAll,
    getById,
    updateStatus,
};
