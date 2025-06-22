import { Request, Response } from "express";

import ActivityService from "../services/activity.service";
import { IPagination } from "../types/express";
import TaskService from "../services/task.service";

const taskService = new TaskService();
const activityService = new ActivityService();

const create = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await taskService.create({
            title: req.body.title,
            description: req.body.description,
            priority: req.body.priority,
            addedDate: req.body.addedDate,
            addedBy: req.verifiedUser,
            project: req.body.project,
            status: req.body.status,
            assignedBy: req.body.assignedBy,
            assignedTo: req.body.assignTo,
            taskLabel: req.body.taskLabel,
            taskUploads: req.body.taskUploads,
        });
        res.status(201).json({
            success: true,
            data: data,
            message: "Task created successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: error,
        });
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

const update = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const response = await taskService.update(Number(id), {
            title: req.body.title,
            description: req.body.description,
            priority: req.body.priority,
            addedDate: req.body.addedDate,
            addedBy: req.body.addedBy,
            project: req.body.project,
            status: req.body.status,
            assignedBy: req.body.assignedBy,
            assignedTo: req.body.assignedTo,
            taskLabel: req.body.taskLabel,
            taskUploads: req.body.taskUploads,
            updatedTaskUploads: req.body.updatedTaskUploads,
        });
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

const getActivityByTaskId = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { taskId } = req.params;

    try {
        const response = await activityService.getActivityByTaskId({
            taskId: Number(taskId),
        });
        res.status(200).json({
            success: true,
            data: response,
            message: "Activity fetched successfully",
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
    update,
    getActivityByTaskId,
};
