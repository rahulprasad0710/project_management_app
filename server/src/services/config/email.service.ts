import { TEmail } from "../../types/types";
import { User } from "../../db/entity/User";
import { addEmailToQueue } from "../../jobs/emailQueue";

export class EmailService {
    constructor() {}

    async sendVerificationEmail(user: User, verifyLink: string) {
        const emailObj: TEmail = {
            to: [user.email],
            subject: "Welcome to the project",
            html: `
                    <h1>Welcome to the project</h1>
                    <p>Your employee id is ${user.employeeId}</p>
                    <p>Please login to the app <a href="${verifyLink}">here</a></p>
                    `,
            text: `
                    Welcome to the project
                    Your employee id is ${user.employeeId}
                    Please login to the app
                    `,
        };
        await addEmailToQueue(emailObj);
        return verifyLink;
    }
}
