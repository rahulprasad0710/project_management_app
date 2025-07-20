import { Router as ExpressRouter } from "express";
import asyncTryCatchFn from "../utils/asyncTryCatchFn";
import authController from "../controllers/auth.controller";
import verifyToken from "../middlewares/authentication";

const router = ExpressRouter();

router.post("/login", asyncTryCatchFn(authController.login));
router.post("/logout", verifyToken, asyncTryCatchFn(authController.logout));
router.post(
    "/refreshUser",
    verifyToken,
    asyncTryCatchFn(authController.logout)
);

router.post(
    "/verify-email",
    asyncTryCatchFn(authController.verifyEmailAndSetPassword)
);

export default router;
