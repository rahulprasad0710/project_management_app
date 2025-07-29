import {
    BeforeInsert,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";

import { User } from "./User";

@Entity()
export class AdminAudit {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    logId: string;

    @ManyToOne(() => User)
    logBy: User;

    @Column()
    logFor: string;

    @Column()
    logAt: Date;

    @Column({ nullable: true })
    message: string;

    @BeforeInsert()
    setCreateDates() {
        this.logAt = new Date();
    }
}
