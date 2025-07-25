import { Router as ExpressRouter } from "express";
import { PERMISSION_ENUM } from "../enums/Permission";
import applyPagination from "../middlewares/applyPagination";
import authorizePermission from "../middlewares/authorization";
import labelController from "../controllers/label.controller";

//  authorizePermission(PERMISSION_ENUM.READ_LABEL),
const router = ExpressRouter();

router.post("", labelController.create);
router.get("", applyPagination, labelController.getAll);
router.put("/status/:id", labelController.updateStatus);
router.get("/:id", labelController.getById);

export default router;
