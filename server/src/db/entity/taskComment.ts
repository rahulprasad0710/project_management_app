import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { Task } from "./task";
import { User } from "./User";

@Entity()
export class TaskComment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @Column()
    addedAt: Date;

    @OneToOne(() => User, (user) => user.id)
    addedBy: User;

    @OneToOne(() => Task, (task) => task.id)
    taskId: User;
}
