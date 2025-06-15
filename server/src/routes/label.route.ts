import { Router as ExpressRouter } from "express";
import applyPagination from "../middlewares/applyPagination";
import labelController from "../controllers/label.controller";

const router = ExpressRouter();

router.post("", labelController.create);
router.get("", applyPagination, labelController.getAll);
router.put("/status/:id", labelController.updateStatus);
router.get("/:id", labelController.getById);

export default router;
