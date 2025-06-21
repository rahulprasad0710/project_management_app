import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Notification } from "./Notification";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    username: string;

    @OneToMany(() => Notification, (notification) => notification.recipient)
    notifications: Notification[];

    // @Column({ unique: true })
    // email: string;

    @Column({
        default: null,
    })
    profilePictureUrl: string;

    @Column()
    cognitoId: string;
}
