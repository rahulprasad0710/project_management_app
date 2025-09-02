import { Request, Response } from "express";

import UploadService from "../services/upload.service";

const uploadService = new UploadService();

const getPresignedUrl = async (req: Request, res: Response): Promise<void> => {
    const { fileName } = req.query;
    const fileNameStr = fileName as string;

    const url = await uploadService.getPresignedUrl({
        bucketKey: fileNameStr,
    });
    res.status(200).json({
        success: true,
        data: url,
        message: "Presigned URL generated",
    });
};

const create = async (req: Request, res: Response): Promise<void> => {
    const { verifiedUserId } = req;
    const { file } = req;

    if (!file) return;

    const result = await uploadService.create(file, verifiedUserId);
    res.status(201).json({
        success: true,
        data: result,
        message: "File uploaded",
    });
};

const getSignedUrlByUploadId = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { uploadId } = req.params;

    const result = await uploadService.getSignedUrlByUploadId(String(uploadId));
    res.status(201).json({
        success: true,
        data: result,
        message: "File fetched successfully.",
    });
};

export default {
    create,
    getPresignedUrl,
    getSignedUrlByUploadId,
};
