import { UploadFile } from "../db/entity/uploads";
import { User } from "../db/entity/User";
import awsService from "../aws/s3.server";
import dataSource from "../db/data-source";

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

export class UploadService {
    constructor(
        private readonly uploadRepository = dataSource.getRepository(
            UploadFile
        ),
        private readonly userRepository = dataSource.getRepository(User)
    ) {}

    async create(uploadFile: IAwsUploadFile, userId: number) {
        const { ETag } = await awsService.putRequestToS3(uploadFile);

        const user = await this.userRepository.findOne({
            where: { id: userId },
        });

        if (!ETag || !user) {
            throw new Error("Upload Error");
        }

        const uploadPayload = new UploadFile();

        const id = Math.round(1000 * Math.random());

        uploadPayload.filename = `${id}_${uploadFile.originalname}`;
        uploadPayload.originalname = uploadFile.originalname;
        uploadPayload.size = uploadFile.size;
        uploadPayload.extension = uploadFile.mimetype;
        uploadPayload.mimetype = uploadFile.mimetype;
        uploadPayload.fileType = uploadFile.mimetype;
        uploadPayload.cloudPath = uploadFile.originalname;
        uploadPayload.cloudId = ETag;
        uploadPayload.cloudUrl = uploadFile.originalname;
        uploadPayload.createdBy = user;
        uploadPayload.createdAt = new Date();
        uploadPayload.updatedAt = new Date();

        const result = await this.uploadRepository.save(uploadPayload);
        console.log("LOG: ~ UploadService ~ create ~ result:", result);

        return result;
    }

    async getPresignedUrl({ bucketKey }: { bucketKey: string }) {
        const url = await awsService.getPreSignedUrl({
            bucketKey,
        });
        return url;
    }
}

export default UploadService;
