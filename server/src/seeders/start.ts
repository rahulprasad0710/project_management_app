import APP_CONSTANT from "../constants/AppConfig";
import UserService from "../services/users.service";
import dataSource from "../db/data-source";

const userService = new UserService();

async function startApp() {
    try {
        await dataSource.initialize();

        // INSERT ADMIN ROLE
        const insertedRole = await dataSource.query(
            `INSERT into "role" ( "isActive" , name) 
        VALUES ( $1, $2) RETURNING id `,
            [true, "ADMIN2"]
        );

        console.log({
            insertedRole,
        });

        const insertedInternalCompany = await dataSource.query(
            `INSERT INTO internal_company (
                name,
                slug,
                "logoUrl",
                address,
                "contactEmail",
                "contactPhone",
                "isActive",
                "createdAt",
                "updatedAt"
            ) VALUES (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                $8,
                $9
                ) RETURNING id `,
            [
                "TechNova Inc",
                "technova-inc",
                "https://example.com/logos/technova.png",
                "123 Innovation Drive, Silicon Valley, CA",
                "contact@technova.com",
                "+1-800-555-1234",
                true,
                "2025-07-25 19:27:51.872423",
                "2025-07-25 19:27:51.872423",
            ]
        );

        const addEmployeeResponse = await userService.create({
            email: APP_CONSTANT.START_APP_EMAIL ?? "",
            mobileNumber: "9819828300",
            firstName: "Avinash",
            lastName: "Sharma",
            role: insertedRole[0].id as number,
            internalCompany: [insertedInternalCompany[0].id as number],
        });

        const addAdminToInternalCompany = await await dataSource.query(
            `  INSERT INTO internal_company_member (
                internal_company_id,
                user_id
                ) VALUES ( $1, $2) `,
            [insertedInternalCompany[0].id, addEmployeeResponse.id]
        );

        const insertFeature = await await dataSource.query(
            `INSERT INTO "feature" (
                name,
                description,
                slug,
                "active",
                "profilePicture",
                "internalCompanyId",
                "adminId",
                "activeSprintId"
            ) VALUES  (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $6,
                $7,
                $8
                ) RETURNING id `,
            [
                "Booking",
                "Handles hotel room booking process",
                "booking",
                true,
                null,
                insertedInternalCompany[0].id,
                addEmployeeResponse.id,
                null,
            ]
        );
        console.log({
            insertedInternalCompany,
            addEmployeeResponse,
            addAdminToInternalCompany,
            insertFeature,
        });
    } catch (error) {
        console.log("start App Error", error);
    }
}

startApp();
