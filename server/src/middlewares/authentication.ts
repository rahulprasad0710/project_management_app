import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, TokenExpiredError, VerifyErrors } from "jsonwebtoken";

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
    try {
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
    } catch (error) {
        next(error);
    }
};

const verifyFromCredentials = async (token: string): Promise<User | null> => {
    try {
        const decoded = jwt.verify(
            token,
            APP_CONSTANT.JWT_ACCESS_SECRET as string
        );

        // Check if token is decoded and has an id
        if (
            typeof decoded !== "object" ||
            decoded === null ||
            !("id" in decoded)
        ) {
            throw new AppError(
                "Invalid token payload",
                401,
                ErrorType.AUTH_ERROR
            );
        }

        const userFromDB = await userService.getById(Number(decoded.id));

        if (!userFromDB) {
            throw new AppError("User not found", 404, ErrorType.AUTH_ERROR);
        }

        return userFromDB;
    } catch (error: unknown) {
        if (typeof error === "object" && error !== null && "name" in error) {
            const name = (error as { name: string }).name;

            if (name === "TokenExpiredError") {
                throw new AppError(
                    "Token has expired",
                    401,
                    ErrorType.EXPIRED_TOKEN_ERROR
                );
            }

            if (name === "JsonWebTokenError") {
                throw new AppError("Invalid token", 401, ErrorType.AUTH_ERROR);
            }
        }

        throw new AppError("Authentication failed", 401, ErrorType.AUTH_ERROR);
    }
};

export default verifyToken;
