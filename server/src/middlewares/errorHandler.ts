import { NextFunction, Request, Response } from "express";

import AppError from "../utils/AppError";

const errorHandler = (
    err: unknown | AppError,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            data: null,
            message: err.message,
            devMessage: err.errorType,
            info: err.stack,
        });
    } else {
        res.status(500).json({
            success: false,
            data: null,
            message: "Something went wrong.",
            devMessage: err instanceof Error ? err.message : String(err),
            info: err instanceof Error ? err : undefined,
        });
    }
};

export default errorHandler;
