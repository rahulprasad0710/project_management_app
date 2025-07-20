import Queue, { Job } from "bull";

import { TEmail } from "./../types/types";

const redisConfig = {
    redis: {
        port: 6379, // Redis server port
        host: "localhost", // Redis server host
    },
};
const emailQueue = new Queue("email-queue", redisConfig);

export async function addEmailToQueue(data: TEmail) {
    await emailQueue.add("email-queue", data);
}

export default emailQueue;
