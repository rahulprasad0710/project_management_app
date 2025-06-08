import {
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";

import AWS_CONSTANT from "../constants/AWSConfig";

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

async function putRequestToS3(uploadFile: IAwsUploadFile) {
    const bufferData = uploadFile.buffer;
    const params = {
        Bucket: AWS_CONSTANT.AWS_BUCKET_NAME,
        Key: uploadFile.originalname,
        Body: bufferData,
        ContentType: uploadFile.mimetype,
    };

    const command = new PutObjectCommand(params);

    const results = await client.send(command);
    console.log("LOG: ~ uploadToS3 ~ results:", results);

    return results;
}

async function getPreSignedUrl({ bucketKey }: { bucketKey: string }) {
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: bucketKey,
        Expires: 60 * 60,
    };

    const command = new GetObjectCommand(params);
    const results = await client.send(command);
    console.log({ results });
    return results;
}

export default {
    getPreSignedUrl,
    putRequestToS3,
};
