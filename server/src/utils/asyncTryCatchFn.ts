import { NextFunction, Request, Response } from "express";

import AppError from "./AppError";

const asyncTryCatchFn =
    (
        controller: (
            req: Request,
            res: Response,
            next: NextFunction
        ) => Promise<void>
    ) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await controller(req, res, next);
        } catch (error) {
            next(error);
        }
    };

export default asyncTryCatchFn;
