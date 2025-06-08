import {
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";

import AWS_CONSTANT from "../constants/AWSConfig";
import { generateUniqueId } from "../utils/generateUniqueId";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// const randomKey = Math.random().toString(36).substring(2, 15);

interface IAwsUploadFile {
    buffer: Buffer;
    mimetype: string;
    originalname: string;
    size: number;
}

if (
    !AWS_CONSTANT.S3_ACCESS_KEY_ID ||
    !AWS_CONSTANT.S3_SECRET_ACCESS_KEY ||
    !AWS_CONSTANT.S3_REGION
) {
    throw new Error("Missing AWS configuration");
}

console.log({
    region: AWS_CONSTANT.S3_REGION,
    Bucket: AWS_CONSTANT.AWS_BUCKET_NAME,
    credentials: {
        accessKeyId: AWS_CONSTANT.S3_ACCESS_KEY_ID,
        secretAccessKey: AWS_CONSTANT.S3_SECRET_ACCESS_KEY,
    },
});

const client = new S3Client({
    region: AWS_CONSTANT.S3_REGION,
    credentials: {
        accessKeyId: AWS_CONSTANT.S3_ACCESS_KEY_ID,
        secretAccessKey: AWS_CONSTANT.S3_SECRET_ACCESS_KEY,
    },
});

async function putRequestToS3(uploadFile: IAwsUploadFile, key: string) {
    const bufferData = uploadFile.buffer;

    const params = {
        Bucket: AWS_CONSTANT.AWS_BUCKET_NAME,
        Key: key,
        Body: bufferData,
        ContentType: uploadFile.mimetype,
    };

    const command = new PutObjectCommand(params);

    const results = await client.send(command);
    console.log("LOG: ~ uploadToS3 ~ results:", results);

    return results;
}

async function getPreSignedUrl({ bucketKey }: { bucketKey: string }) {
    console.log({
        bucketKey,
    });
    try {
        const command = new GetObjectCommand({
            Bucket: AWS_CONSTANT.AWS_BUCKET_NAME,
            Key: bucketKey,
        });

        const url = await getSignedUrl(client, command, { expiresIn: 3600 }); // 1 hour
        console.log("LOG: ~ getPreSignedUrl ~ url:", url);
        return url;
    } catch (error) {
        console.log("LOG: ~ getPreSignedUrl ~ error:", error);
        throw new Error(error instanceof Error ? error.message : String(error));
    }
}

export default {
    getPreSignedUrl,
    putRequestToS3,
};
