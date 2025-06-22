import { NextFunction, Request, Response } from "express";

import APP_CONSTANT from "../constants/AppConfig";
import UserService from "../services/users.service";
import { getGoogleUserInfo } from "../services/auth.service";

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
        console.log("LOG: ~ authHeader:", authHeader);

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

        const googleUser = await getGoogleUserInfo(token);

        if (!googleUser) {
            res.status(401).json({
                success: false,
                error: "Invalid Token",
                data: null,
            });
            return;
        }

        const {
            email,
            name,
            picture,
            email_verified,
            family_name,
            given_name,
            sub,
        } = googleUser;

        const verifiedUser = await userService.getByEmail(email);

        if (!verifiedUser) {
            const newUser = await userService.create({
                firstName: given_name,
                lastName: family_name,
                username: name,
                cognitoId: sub,
                email: email,
                profilePictureUrl: picture,
                loginType: "google",
                emailVerified: email_verified,
            });
            console.log("LOG: ~ newUser:", newUser);

            req.verifiedUserId = newUser.id;
            req.verifiedUser = newUser;
            next();
        } else {
            // Attach user ID to request
            req.verifiedUserId = verifiedUser.id;
            req.verifiedUser = verifiedUser;
            next();
        }
    } catch (error) {
        console.log("LOG: ~ error:", error);
        res.status(500).json({
            success: false,
            error: "Something Went Wrong.",
            data: null,
        });
    }
};

export default verifyToken;
