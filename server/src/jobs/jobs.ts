import { TEmail } from "../types/types";
import { getEmailQueue } from "./emailQueue";
import { sendEmail } from "../config/email.config";

async function startQueue() {
    // Process jobs from the queue
    const emailQueue = await getEmailQueue(); // ensure queue is ready
    emailQueue.process("email-queue", async (job) => {
        const emailTemplate: TEmail = job.data;

        const response = await sendEmail(emailTemplate);
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
