import { Router as ExpressRouter } from "express";
import applyPagination from "../middlewares/applyPagination";
import asyncTryCatchFn from "../utils/asyncTryCatchFn";
import usersController from "../controllers/users.controller";

const router = ExpressRouter();

router.post("", asyncTryCatchFn(usersController.create));
router.get("", applyPagination, asyncTryCatchFn(usersController.getAll));

export default router;
