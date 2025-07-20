import { Job } from "bull";
import { TEmail } from "../types/types";
import emailQueue from "./emailQueue";

const sendEmailMock = async (job: Job<TEmail>) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(
                `Job ${job.id} completed successfully after ${job.timestamp}`
            );
        }, 2000);
    });
};

function startQueue() {
    // Process jobs from the queue
    emailQueue.process("email-queue", async (job) => {
        console.log("Processing job:", job.data);
        const response = await sendEmailMock(job);
        return response;
    });

    // Event listener for completed jobs
    emailQueue.on("completed", (job, result) => {
        console.log(`Job ID ${job.id} completed with result:`, result);
    });

    // Event listener for failed jobs
    emailQueue.on("failed", (job, err) => {
        console.error(`Job ID ${job.id} failed with error:`, err);
    });
}

export default startQueue;
