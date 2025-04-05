import { Router as ExpressRouter } from "express";

import usersController from "../controllers/users.controller";

const router = ExpressRouter();

router.post("", usersController.create).get("", usersController.getAll);

export default router;
