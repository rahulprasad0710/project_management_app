import { Request, Response } from "express";

import authService from "../services/auth.service";

const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const { user, accessToken, refreshToken } =
        await authService.loginWithCredentials(email, password);

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
        .status(200)
        .json({
            success: true,
            data: {
                id: user?.id,
                email: user?.email,
                type: "credentials",
                accessToken,
                refreshToken,
            },
            message: "login successful",
        });
};

const logout = async (req: Request, res: Response) => {
    const { verifiedUserId } = req;
    const response = await authService.logout(verifiedUserId);

    res.status(200).json({
        success: true,
        data: response,
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

const refreshUser = async (req: Request, res: Response) => {
    const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;

    const response = await authService.refreshUser(incomingRefreshToken);
    res.status(200).json({
        success: true,
        data: response,
        message: "User refreshed successfully",
    });
};

export default {
    login,
    verifyEmailAndSetPassword,
    logout,
};
