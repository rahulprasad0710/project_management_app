import Queue, { QueueOptions, Queue as QueueType } from "bull";

import { RedisConfig } from "../config/redis.config";
import { TEmail } from "./../types/types";

let emailQueue: QueueType<TEmail> | null = null;

export async function getEmailQueue(): Promise<QueueType<TEmail>> {
    if (emailQueue) return emailQueue;

    const redisClient = await RedisConfig.getInstance();

    const options: QueueOptions = {
        createClient: (type) => {
            switch (type) {
                case "client":
                    return redisClient;
                case "subscriber":
                    return redisClient.duplicate();
                default:
                    return redisClient;
            }
        },
    };

    emailQueue = new Queue<TEmail>("email-queue", options);
    console.log("LOG: ~ Email queue initialized with shared Redis config");

    return emailQueue;
}

export async function addEmailToQueue(data: TEmail) {
    const queue = await getEmailQueue();
    await queue.add("email-job", data);
}
