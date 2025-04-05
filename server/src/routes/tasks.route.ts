import { Router as ExpressRouter } from "express";

import taskController from "../controllers/task.controller";
import applyPagination from "../middlewares/applyPagination";

const router = ExpressRouter();

router.post("", taskController.create);
router.get("", applyPagination, taskController.getAll);
router.put("/status/:taskId", taskController.updateStatus);
router.get("/:id", taskController.getById);

export default router;
