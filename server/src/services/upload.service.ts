import { GetObjectCommandOutput } from "@aws-sdk/client-s3";
import { UploadFile } from "../db/entity/uploads";
import { User } from "../db/entity/User";
import awsService from "../aws/s3.server";
import dataSource from "../db/data-source";
import { generateUniqueId } from "../utils/generateUniqueId";

interface IAwsUploadFile {
    buffer: Buffer;
    mimetype: string;
    originalname: string;
    size: number;
}

export interface IUploadFile {
    filename: string;
    originalname: string;
    size: number;
    extension: string;
    mimetype?: string;
    fileType?: string;
    cloudPath?: string;
    cloudId?: string;
    cloudUrl?: string;
    createdBy: User;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUploadFileURL extends IUploadFile {
    id: string;
    backendUrl: string;
}

export class UploadService {
    constructor(
        private readonly uploadRepository = dataSource.getRepository(
            UploadFile
        ),
        private readonly userRepository = dataSource.getRepository(User)
    ) {}

    async create(uploadFile: IAwsUploadFile, userId: number) {
        const id = await generateUniqueId();
        const s3Key = `${id}_${uploadFile.originalname}`;

        const { ETag } = await awsService.putRequestToS3(uploadFile, s3Key);

        const user = await this.userRepository.findOne({
            where: { id: userId },
        });

        if (!ETag || !user) {
            throw new Error("Upload Error");
        }

        const uploadPayload = new UploadFile();

        uploadPayload.filename = `${id}_${uploadFile.originalname}`;
        uploadPayload.originalname = uploadFile.originalname;
        uploadPayload.size = uploadFile.size;
        uploadPayload.extension = uploadFile.mimetype;
        uploadPayload.mimetype = uploadFile.mimetype;
        uploadPayload.fileType = uploadFile.mimetype;
        uploadPayload.cloudPath = `${id}_${uploadFile.originalname}`;
        uploadPayload.cloudId = ETag;
        uploadPayload.cloudUrl = uploadFile.originalname;
        uploadPayload.createdBy = user;
        uploadPayload.createdAt = new Date();
        uploadPayload.updatedAt = new Date();

        const result = await this.uploadRepository.save(uploadPayload);
        return result;
    }

    async getPresignedUrl({ bucketKey }: { bucketKey: string }) {
        console.log({
            bucketKey,
        });
        const url = await awsService.getPreSignedUrl({
            bucketKey,
        });
        return url;
    }

    async getUrlList(EtagList: UploadFile[]) {
        let response: IUploadFileURL[] = [];

        response = await Promise.all(
            EtagList.map(async (file: UploadFile) => {
                const result = await this.getPresignedUrl({
                    bucketKey: file.filename,
                });
                return {
                    ...file,
                    backendUrl: result,
                };
            })
        );
        return response;
    }
}

export default UploadService;
