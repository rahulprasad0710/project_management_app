import { Router as ExpressRouter } from "express";
import permissionController from "../controllers/permission.controller";

const router = ExpressRouter();

router.get("/groups", permissionController.getAllPermissionGroups);
router.get("/groups/:id", permissionController.getPermissionGroupById);
router.get("/:id", permissionController.getPermissionById);

export default router;
