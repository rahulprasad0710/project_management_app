import { DataSource, ViewColumn, ViewEntity } from "typeorm";

import { Role } from "../entity/role";
import { User } from "../entity/User";

@ViewEntity({
    name: "user_view",
    expression: (dataSource: DataSource) =>
        dataSource
            .createQueryBuilder()
            .select("u.id", "id")
            .addSelect("u.email", "email")
            .addSelect("u.firstName", "firstName")
            .addSelect("u.lastName", "lastName")
            .addSelect("u.employeeId", "employeeId")
            .addSelect("r.name", "roleName")
            .addSelect("u.department", "department")
            .addSelect("u.mobileNumber", "mobileNumber")
            .addSelect("u.emailVerified", "emailVerified")
            .addSelect("u.isActive", "isActive")
            .addSelect("u.createdAt", "createdAt")
            .from(User, "u")
            .leftJoin(Role, "r", "u.roleId = r.id"),
})
export class UserView {
    @ViewColumn()
    id: number;

    @ViewColumn()
    email: string;

    @ViewColumn()
    firstName: string;

    @ViewColumn()
    lastName: string;

    @ViewColumn()
    employeeId: string;

    @ViewColumn()
    roleName: string;

    @ViewColumn()
    department: string;

    @ViewColumn()
    mobileNumber: string;

    @ViewColumn()
    emailVerified: boolean;

    @ViewColumn()
    isActive: boolean;

    @ViewColumn()
    createdAt: Date;
}
