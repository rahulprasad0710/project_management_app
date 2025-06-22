import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Notification } from "./Notification";

@Entity()
export class User {
    constructor() {
        this.createdAt = new Date();
        this.isActive = true;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    cognitoId: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    username: string;

    @OneToMany(() => Notification, (notification) => notification.recipient)
    notifications: Notification[];

    @Column()
    loginType: string;

    @Column()
    emailVerified: boolean;

    @Column()
    isActive: boolean;

    @Column()
    createdAt: Date;

    @Column({ nullable: true })
    profilePictureUrl: string;
}
