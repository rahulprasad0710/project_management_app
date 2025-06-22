import { NextFunction, Request, Response } from "express";

import APP_CONSTANT from "../constants/AppConfig";
import { OAuth2Client } from "google-auth-library";
import UserService from "../services/users.service";

const client = new OAuth2Client();
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
            res.status(401).json({ success: false, error: "Access Denied" });
            return;
        }

        const ticket = await client.verifyIdToken({
            idToken:
                "eyJhbGciOiJSUzI1NiIsImtpZCI6IjFiYjc3NGJkODcyOWVhMzhlOWMyZmUwYzY0ZDJjYTk0OGJmNjZmMGYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIzMjUxMzAzODIxNC1oOGZqMnR1Y2xpMmJwa2I4NnZwOWZmNThsMzV0cWowbi5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjMyNTEzMDM4MjE0LWg4ZmoydHVjbGkyYnBrYjg2dnA5ZmY1OGwzNXRxajBuLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTAxMDA4NTkyMjkzNDA1NDM5ODYyIiwiZW1haWwiOiJyYXVsc2hhaDE1NDEyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiZ09OMjVpT0tDX2F5ZTd3MW5nVW9IZyIsIm5hbWUiOiJyYWh1bCBwcmFzYWQiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jS1M5MHM0U2VSMXVwbElyWlk2TExOeGlBYUM3Mm1RM2dCTkRXaC0zc1dpTTFKS1NEMno9czk2LWMiLCJnaXZlbl9uYW1lIjoicmFodWwiLCJmYW1pbHlfbmFtZSI6InByYXNhZCIsImlhdCI6MTc1MDU0Mjg3NywiZXhwIjoxNzUwNTQ2NDc3fQ.rHgTee42evce6-8I_6iAlog-7Kk7irZFI4OTwG2OGGz_F2w5YVxX5dxWLrO0mdOszomKEJeTAcfDWVHnuHFJJnSSBEyFXVZ-HKLIDqdk31YdJXDn3Z5bkmnizaVtBI6132y27Ha17IaeRWQhDB1-38fhegDaPyi8WgfZaiH4CrSPUWTnTSlRlFe4bJolm_TGBXZ24P8XKA1Y6b-2V9tuzloGRH9nv9TakwOuNW0BEICZIo1nsH8A382IkWWAkgkQPYZotAniAPPcRy3KoRMYQqhWnznIIJFG9HKRIK4nKP8LTKmfaMTBzDWuKG4YAQvgQhAPFwuYybEk3thNsEkoFw",
            audience: APP_CONSTANT.GOOGLE_CLIENT_ID,
        });
        console.log("LOG: ~ ticket:", ticket);

        const payload = ticket.getPayload();
        console.log("LOG: ~ payload:", payload);

        if (!payload) {
            res.status(401).json({ success: false, error: "Invalid Token" });
            return;
        } else {
            const verifiedUser = await userService.getByEmail(
                payload?.email as string
            );
            if (!verifiedUser) {
                res.status(401).json({
                    success: false,
                    error: "Invalid Token",
                });
                return;
            }

            // Attach user ID to request
            req.verifiedUserId = verifiedUser.id;
            req.verifiedUser = verifiedUser;
            next();
        }
    } catch (error) {
        console.log("LOG: ~ error:", error);
        res.status(400).json({
            success: false,
            error: "Something Went Wrong.",
            data: null,
        });
    }
};

export default verifyToken;
