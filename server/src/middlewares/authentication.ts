import { GoogleUserInfo, getGoogleUserInfo } from "../services/auth.service";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import APP_CONSTANT from "../constants/AppConfig";
import { User } from "../db/entity/User";
import UserService from "../services/users.service";

const userService = new UserService();

// declare module "express-serve-static-core" {
//     interface Request {
//         verifiedUserId?: number;
//     }
// }

const verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        const provider = req.headers["x-provider"];

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

        let user: User | null = null;
        if (provider !== "google") {
            user = await verifyFromCredentials(token);
        }

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
        res.status(500).json({
            success: false,
            error: "Something Went Wrong.",
            data: null,
        });
    }
};

const verifyFromCredentials = async (token: string): Promise<User | null> => {
    try {
        const decoded = jwt.decode(token);

        if (decoded && typeof decoded === "object" && "id" in decoded) {
            const userId = (decoded as JwtPayload & { id: string }).id;
            console.log("User ID:", userId);
        } else {
            throw new Error("Invalid token payload");
        }

        const userFromDB = await userService.getById(Number(decoded.id));
        console.log("LOG: ~ verifyFromCredentials ~ userFromDB:", userFromDB);

        if (!userFromDB) {
            return null;
        } else {
            return userFromDB;
        }
    } catch (error) {
        throw new Error("Invalid Token");
    }
};

// const verifyFromGoogle = async (token: string): Promise<User | null> => {
//     try {
//         const googleUser = await getGoogleUserInfo(token);
//         console.log("LOG: ~ verifyFromGoogle ~ googleUser:", googleUser)

//         if (!googleUser) {
//             return null;
//         }

//         const {
//             email,
//             name,
//             picture,
//             email_verified,
//             family_name,
//             given_name,
//             sub,
//         } = googleUser;

//         const verifiedUser = await userService.getByEmail(email);

//         if (!verifiedUser) {
//             const newUser = await userService.create({
//                 firstName: given_name,
//                 lastName: family_name,
//                 email: email,
//                 emailVerified: email_verified,
//             });
//             return newUser;
//         } else {
//             return verifiedUser;
//         }
//     } catch (error) {
//         throw new Error("Invalid Token");
//     }
// };

export default verifyToken;
