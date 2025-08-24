import { IBookingResponse } from "../../types/payload";
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

    async sendBookingConfirmationEmail(booking: IBookingResponse) {
        console.log(
            "LOG: ~ EmailService ~ sendBookingConfirmationEmail ~ sendBookingConfirmationEmail:"
        );
        const customer = booking.customer;

        const roomsList = booking.bookedRoomResult
            .map(
                (r) => `
        <li>
          Room ${r.room.roomNumber} - ${r.room.roomType.name} 
          <br/>
          Facilities: ${r.room.roomType.facilities.join(", ")}
          <br/>
          Price: $${r.room.roomType.roomPrice}
        </li>
      `
            )
            .join("");

        const emailObj: TEmail = {
            // to: [customer.email],
            to: ["retta.stracke@ethereal.email"], // Email to test

            subject: `Booking Confirmation - ${booking.userBookingId}`,
            html: `
                <h1>Booking Confirmation</h1>
                <p>Dear ${customer.name},</p>
                <p>Your booking <strong>${
                    booking.userBookingId
                }</strong> has been confirmed.</p>
                <p><strong>Check-in:</strong> ${new Date(
                    booking.checkInDate
                ).toLocaleString()}</p>
                <p><strong>Check-out:</strong> ${new Date(
                    booking.checkOutDate
                ).toLocaleString()}</p>
                <p><strong>Total Price:</strong> $${booking.totalPrice}</p>
                <p><strong>Payment Method:</strong> ${
                    booking.payment_status
                }</p>
                <h3>Rooms Booked:</h3>
                <ul>${roomsList}</ul>
                <br/>
                <p>We look forward to hosting you!</p>
                `,
            text: `
                Dear ${customer.name},

                Your booking ${booking.userBookingId} has been confirmed.

                Check-in: ${new Date(booking.checkInDate).toLocaleString()}
                Check-out: ${new Date(booking.checkOutDate).toLocaleString()}
                Total Price: $${booking.totalPrice}
                Payment Method: ${booking.payment_status}

                Rooms Booked:
                ${booking.bookedRoomResult
                    .map(
                        (r) =>
                            `Room ${r.room.roomNumber} - ${
                                r.room.roomType.name
                            } (${r.room.roomType.facilities.join(", ")}) - $${
                                r.room.roomType.roomPrice
                            }`
                    )
                    .join("\n")}

                We look forward to hosting you!
                `,
        };

        const addEmailToQueueResponse = await addEmailToQueue(emailObj);
        console.log(
            "LOG: ~ EmailService ~ sendBookingConfirmationEmail ~ addEmailToQueueResponse:",
            addEmailToQueueResponse
        );
        return booking.id;
    }
}
