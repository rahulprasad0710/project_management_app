import { Request, Response } from "express";

import { IPagination } from "../types/express";
import ProjectService from "../services/projects.service";
const projectService = new ProjectService();

const create = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await projectService.create({
            name: req.body.name,
            description: req.body.description,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            admin: req.body.admin,
            team_member: req.body.team_member,
            status: req.body.status,
            priority: req.body.priority,
        });
        res.status(201).json({
            success: true,
            data: data,
            message: "Project created successfully",
        });
    } catch (error) {
        res.status(500).json({
            data: null,
            success: false,
            message: "Error creating project",
            error: error,
        });
    }
};

const getAll = async (req: Request, res: Response) => {
    try {
        const { skip, take, keyword, isPaginationEnabled }: IPagination =
            req.pagination;

        console.log({
            skip,
            take,
            keyword,
            isPaginationEnabled,
        });

        const users = await projectService.getAll({
            skip,
            take,
            keyword,
            isPaginationEnabled,
        });
        res.status(200).json({
            success: true,
            data: users,
            message: "Project fetched successfully",
        });
    } catch (error) {
        res.status(500).json({ data: null, success: false, message: error });
    }
};

const getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const users = await projectService.getById(Number(id));
        res.status(200).json({
            success: true,
            data: users,
            message: "Project fetched successfully",
        });
    } catch (error) {
        console.log(
            "LOG: ~ file: project.controller.ts:52 ~ getById ~ error:",
            error
        );
        res.status(500).json({ message: error });
    }
};

const addTeamMember = async (req: Request, res: Response) => {
    const { projectId, userId } = req.body;
    try {
        const response = await projectService.addTeamMember(projectId, userId);
        res.status(200).json({
            success: true,
            data: response,
            message: "Team member added successfully",
        });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

export default {
    create,
    getAll,
    getById,
    addTeamMember,
};
