import applyPagination from "../../middlewares/applyPagination";
import asyncTryCatchFn from "../../utils/asyncTryCatchFn";
import express from "express";
import roomController from "../../controllers/hotel/room.controller";

const router = express.Router();

// RoomType routes
router.post("/room-types", applyPagination, roomController.create);
router.get("/room-types", asyncTryCatchFn(roomController.getAll));
router.get("/room-types/:id", asyncTryCatchFn(roomController.getById));
router.put("/room-types/:id", asyncTryCatchFn(roomController.update));
router.delete("/room-types/:id", asyncTryCatchFn(roomController.delete));

export default router;
