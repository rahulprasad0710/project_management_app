import UserService from "../services/users.service";
const userService = new UserService();
import { Request, Response } from "express";

const create = async (req: Request, res: Response) => {
    try {
        const { user } = req.body;
        const data = await userService.create(user);
        res.status(201).json({
            success: true,
            data: data,
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
