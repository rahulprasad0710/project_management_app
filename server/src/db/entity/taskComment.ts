import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { User } from "./User";
import { Task } from "./task";

@Entity()
export class TaskComment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @Column()
    addedat: Date;

    @OneToOne(() => User, (user) => user.id)
    addedBy: User;

    @OneToOne(() => Task, (task) => task.id)
    taskId: User;
}
