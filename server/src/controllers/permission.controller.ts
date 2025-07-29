import { Request, Response } from "express";

import PermissionService from "../services/permission.service";

const permissionService = new PermissionService();

const getAllPermissionGroups = async (req: Request, res: Response) => {
    const groups = await permissionService.getAllPermissionGroups();
    res.status(200).json({
        success: true,
        data: groups,
        message: "Permission groups fetched successfully",
    });
};

const getPermissionGroupById = async (req: Request, res: Response) => {
    const groupId = Number(req.params.id);

    const group = await permissionService.getPermissionByPermissionGroupId(
        groupId
    );

    res.status(200).json({
        success: true,
        data: group,
        message: "Permission group fetched successfully",
    });
};

const getPermissionById = async (req: Request, res: Response) => {
    const permissionId = Number(req.params.id);

    if (isNaN(permissionId)) {
        res.status(400).json({
            success: false,
            message: "Invalid permission ID",
            data: null,
        });
        return;
    }

    const permission = await permissionService.getPermissionById(permissionId);

    if (!permission) {
        res.status(404).json({
            success: false,
            message: "Permission not found",
            data: null,
        });
        return;
    }

    res.status(200).json({
        success: true,
        data: permission,
        message: "Permission fetched successfully",
    });
};

export default {
    getAllPermissionGroups,
    getPermissionGroupById,
    getPermissionById,
};
