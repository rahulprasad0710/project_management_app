import { Router as ExpressRouter } from "express";
import asyncTryCatchFn from "../utils/asyncTryCatchFn";
import authController from "../controllers/auth.controller";

const router = ExpressRouter();

router.post("/login", asyncTryCatchFn(authController.login));
router.post(
    "/verify-email",
    asyncTryCatchFn(authController.verifyEmailAndSetPassword)
);

export default router;
