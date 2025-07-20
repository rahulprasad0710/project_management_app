import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import APP_CONSTANT from "../constants/AppConfig";
import AppError from "../utils/AppError";
import { ErrorType } from "../enums/Eums";
import { User } from "../db/entity/User";
import UserService from "../services/users.service";

const userService = new UserService();

const verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        res.status(401).json({
            success: false,
            error: "Access Denied",
            data: null,
        });
        return;
    }

    const user = await verifyFromCredentials(token);

    if (!user) {
        res.status(401).json({
            success: false,
            error: "Invalid Token",
            data: null,
        });
        return;
    }

    req.verifiedUserId = user?.id;
    req.verifiedUser = user;
    next();
};

const verifyFromCredentials = async (token: string): Promise<User | null> => {
    const decoded = jwt.verify(
        token as string,
        APP_CONSTANT.JWT_ACCESS_SECRET as string
    );

    if (!decoded) {
        throw new AppError("Invalid token", 401, ErrorType.AUTH_ERROR);
    }

    if (decoded && typeof decoded === "object" && "id" in decoded) {
        const userFromDB = await userService.getById(Number(decoded.id));
        return userFromDB;
    } else {
        return null;
    }
};

export default verifyToken;
