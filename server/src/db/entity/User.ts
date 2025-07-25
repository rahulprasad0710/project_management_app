import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";

import { Notification } from "./Notification";
import { Role } from "./role";

@Entity()
export class User {
    constructor() {
        this.createdAt = new Date();
        this.isActive = false;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ type: "varchar", default: "PMA-0001" })
    employeeId: string;

    @ManyToOne(() => Role, (role) => role.users)
    role: Role;

    @Column({ nullable: true })
    department: string;

    @Column({ type: "varchar", default: "0000-00-00" })
    mobileNumber: string;

    @OneToMany(() => Notification, (notification) => notification.recipient)
    notifications: Notification[];

    @Column({ default: false })
    emailVerified: boolean;

    @Column()
    isActive: boolean;

    @Column()
    createdAt: Date;

    @Column({ nullable: true })
    profilePictureUrl: string;

    @Column({ nullable: true })
    password: string;

    @Column({ nullable: true })
    refreshToken: string;

    @Column({ nullable: true })
    verifyEmailToken: string;
}
