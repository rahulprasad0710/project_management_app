import { Router as ExpressRouter } from "express";
import { PERMISSION_ENUM } from "../enums/Permission";
import applyPagination from "../middlewares/applyPagination";
import authorizePermission from "../middlewares/authorization";
import roleController from "../controllers/role.controller";

//  authorizePermission(PERMISSION_ENUM.READ_LABEL),
const router = ExpressRouter();

router.post("", roleController.create);
router.get("", applyPagination, roleController.getAll);
router.put("/status/:id", roleController.deactivate);
router.put("/:id", roleController.update);
router.get("/:id", roleController.getById);

export default router;
