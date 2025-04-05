import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { User } from "./User";
import { Project } from "./project";

import { Priority, TaskStatus } from "../../enums/Priority";

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn()
    addedBy: User;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn()
    assignedTo: User;

    @Column()
    description: string;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @Column({
        type: "enum",
        enum: TaskStatus,
        default: TaskStatus.TODO,
    })
    status: TaskStatus;

    @Column({
        type: "enum",
        enum: Priority,
        default: Priority.MEDIUM,
    })
    priority: Priority;

    @ManyToOne(() => Project, (project) => project.id)
    @JoinColumn({
        name: "projectId",
    })
    project: Project;
}
