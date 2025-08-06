import { Router as ExpressRouter } from "express";
import { PERMISSION_ENUM } from "../enums/Permission";
import applyPagination from "../middlewares/applyPagination";
import authorizePermission from "../middlewares/authorization";
import labelController from "../controllers/feature.controller";

//  authorizePermission(PERMISSION_ENUM.READ_LABEL),
const router = ExpressRouter();

router.get("/:id/task-status", labelController.getTaskStatusByFeatureId);

export default router;
