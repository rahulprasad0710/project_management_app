import { Request, Response } from "express";

import APP_CONSTANT from "../constants/AppConfig";
import jwt from "jsonwebtoken";
import { loginWithCredentials } from "../services/auth.service";

const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await loginWithCredentials(email, password);

        console.log({
            user,
        });

        const accessToken = jwt.sign(
            { id: user?.id, type: "credentials" },
            APP_CONSTANT.JWT_ACCESS_SECRET as string,
            {
                expiresIn: "15m",
            }
        );

        const refreshToken = jwt.sign(
            { id: user?.id, type: "credentials" },
            APP_CONSTANT.JWT_REFRESH_SECRET as string,
            { expiresIn: "7d" }
        );

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(200).json({
            accessToken,
            user: {
                id: user?.id,
                name: user?.username,
                email: user?.email,
                type: "credentials",
            },
            message: "login successful",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: error instanceof Error ? error.message : String(error),
        });
    }
};

export default {
    login,
};
