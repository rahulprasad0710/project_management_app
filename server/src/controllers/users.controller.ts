import { Request, Response } from "express";

import UserService from "../services/users.service";

const userService = new UserService();

const create = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const response = await userService.create(data);
        res.status(201).json({
            success: true,
            data: response,
            message: "User created successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
};

const getAll = async (req: Request, res: Response) => {
    try {
        const users = await userService.getAll();
        res.status(200).json({
            success: true,
            data: users,
            message: "User fetched successfully",
        });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

export default {
    create,
    getAll,
};

// dsds
