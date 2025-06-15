import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Priority, TaskStatus } from "../../enums/Priority";

import { Label } from "./taskLabel";
import { Project } from "./project";
import { Sprint } from "./sprint";
import { UploadFile } from "./uploads";
import { User } from "./User";

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    // remove nullable for new DB.
    @Column({ nullable: true })
    taskNumber: string;

    @ManyToOne(() => User, (user) => user.id, { nullable: true })
    @JoinColumn()
    addedBy: User;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn()
    assignedTo: User;

    @Column()
    description: string;

    @Column()
    addedDate: Date;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn()
    assignedBy: User;

    @ManyToOne(() => Label, (label) => label.id, { nullable: true })
    @JoinColumn()
    taskLabel: Label;

    @ManyToOne(() => Sprint, (sprint) => sprint.id, { nullable: true })
    @JoinColumn()
    sprint: Sprint;

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

    @ManyToOne(() => Project, (project) => project.id, { nullable: false })
    @JoinColumn({
        name: "projectId",
    })
    project: Project;

    @ManyToMany(() => UploadFile, (upload) => upload.id, {
        cascade: true,
        eager: true,
    })
    @JoinTable({
        name: "task_uploads",
        joinColumn: {
            name: "taskId",
            referencedColumnName: "id",
        },
        inverseJoinColumn: {
            name: "uploadId",
            referencedColumnName: "id",
        },
    })
    taskUploads: UploadFile[];
}
