import { NextFunction, Request, RequestHandler, Response } from "express";

import AppError from "../utils/AppError";
import { ErrorType } from "../enums/Eums";
import { PERMISSION_ENUM } from "../enums/Permission";

type AuthorizePermission = (permissionName: PERMISSION_ENUM) => RequestHandler;

const authorizePermission: AuthorizePermission = (
    permissionName: PERMISSION_ENUM
) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.verifiedUser;
            if (!user) {
                throw new AppError(
                    "Unauthorized: User not found",
                    403,
                    ErrorType.AUTH_ERROR
                );
            }

            const permissions: PERMISSION_ENUM[] =
                user?.role?.permissions?.map(
                    (permission: PERMISSION_ENUM) => permission
                ) ?? [];

            if (!permissions.includes(permissionName)) {
                throw new AppError(
                    "Forbidden: Missing permission",
                    403,
                    ErrorType.UNAUTHORIZED_ERROR
                );
            }
            next();
        } catch (error) {
            next(error);
        }
    };
};

export default authorizePermission;
