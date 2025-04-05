import { Router as ExpressRouter } from "express";

import projectController from "../controllers/project.controller";
import applyPagination from "../middlewares/applyPagination";

const router = ExpressRouter();

router.post("", projectController.create);
router.get("", applyPagination, projectController.getAll);
router.post("/team-members", projectController.addTeamMember);
router.get("/:id", projectController.getById);

export default router;
