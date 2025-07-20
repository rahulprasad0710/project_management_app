import { Request, Response } from "express";

import authService from "../services/auth.service";
import generateToken from "../utils/generateToken";

const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const user = await authService.loginWithCredentials(email, password);

    const accessToken = generateToken.accessToken({
        userId: user?.id,
        userType: "credentials",
        loginType: "credentials",
    });

    const refreshToken = generateToken.refreshToken({
        userId: user?.id,
        userType: "credentials",
        loginType: "credentials",
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
        accessToken,
        user: {
            id: user?.id,
            email: user?.email,
            type: "credentials",
        },
        message: "login successful",
    });
};

const verifyEmailAndSetPassword = async (req: Request, res: Response) => {
    const response = await authService.verifyEmailAndSetPassword({
        id: req.body.id,
        password: req.body.password,
        token: req.body.token,
    });

    res.status(200).json({
        success: true,
        data: response,
        message: "Password set successfully",
    });
};

export default {
    login,
    verifyEmailAndSetPassword,
};
