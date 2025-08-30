import Queue, { QueueOptions, Queue as QueueType } from "bull";

import { TEmail } from "./../types/types";

const redisConfig = {
    redis: {
        port: 6379, // Redis server port
        host: "localhost", // Redis server host
    },
};

let emailQueue: QueueType<TEmail> | null = null;

export async function getEmailQueue(): Promise<QueueType<TEmail>> {
    if (emailQueue) return emailQueue;

    emailQueue = new Queue<TEmail>("email-queue", redisConfig);

    return emailQueue;
}

export async function addEmailToQueue(emailTemplate: TEmail) {
    const emailQueue = await getEmailQueue();
    await emailQueue.add("email-queue", emailTemplate, {
        attempts: 5,
        backoff: {
            type: "exponential",
            delay: 5000,
        },
        removeOnComplete: true,
        removeOnFail: false,
    });
}
