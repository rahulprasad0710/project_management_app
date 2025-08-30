import { TEmail } from "../types/types";
import { getEmailQueue } from "./emailQueue";
import { sendEmail } from "../config/email.config";

async function startQueue() {
    // Process jobs from the queue
    const emailQueue = await getEmailQueue(); // ensure queue is ready
    emailQueue.process("email-queue", async (job) => {
        const emailTemplate: TEmail = job.data;

        try {
            const response = await sendEmail(emailTemplate);
            return response;
        } catch (err: unknown) {
            // TODO  ADD LOGGING
            console.error(`Retrying job ${job.id} due to error:`, err);
            throw err; // ! important: rethrow so Bull knows it failed DO NOT delete this line.
        }
    });

    // Event listener for completed jobs
    emailQueue.on("failed", (job, err) => {
        console.error(
            `Job ID ${job.id} failed on attempt ${job.attemptsMade} of ${job.opts.attempts}. Error:`,
            err
        );
        // TODO: Implement error handling logic (e.g., alerting, retries)
        // For example, you could send an alert to the admin or retry the job
    });
    // Event listener for failed jobs

    emailQueue.on("completed", (job, result) => {
        console.log(
            `✅ Job ID ${job.id} succeeded after ${job.attemptsMade} attempt(s).`
        );
    });
}

export default startQueue;
