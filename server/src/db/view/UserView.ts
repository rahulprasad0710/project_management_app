import { DataSource, OneToMany, ViewColumn, ViewEntity } from "typeorm";

import { Notification } from "../entity/Notification";
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
            .addSelect("u.role", "roleId")
            .addSelect("u.mobileNumber", "mobileNumber")
            .addSelect("u.isActive", "isActive")
            .addSelect("u.profilePictureUrl", "profilePictureUrl")
            .from(User, "u"),
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
    isActive: boolean;

    @OneToMany(() => Notification, (notification) => notification.recipient)
    notifications: Notification[];
}
