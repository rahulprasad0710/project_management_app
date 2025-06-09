import { Router as ExpressRouter } from "express";
import applyPagination from "../middlewares/applyPagination";
import projectController from "../controllers/project.controller";

const router = ExpressRouter();

router.post("", projectController.create);
router.get("", applyPagination, projectController.getAll);
router.post("/team-members", projectController.addTeamMember);
router.get("/:id", projectController.getById);
router.put("/:id", projectController.update);

export default router;
