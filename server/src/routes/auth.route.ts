import { Router as ExpressRouter } from "express";
import authController from "../controllers/auth.controller";

const router = ExpressRouter();

router.post("/login", authController.login);

export default router;
