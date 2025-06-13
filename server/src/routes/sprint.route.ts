import { Router as ExpressRouter } from "express";
import applyPagination from "../middlewares/applyPagination";
import sprintController from "../controllers/sprint.controller";

const router = ExpressRouter();

router.post("", sprintController.create);
router.get("", applyPagination, sprintController.getAll);
router.put("/status/:id", sprintController.updateStatus);
router.get("/:id", sprintController.getById);

export default router;
