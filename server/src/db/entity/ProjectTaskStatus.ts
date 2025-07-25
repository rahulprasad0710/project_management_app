// entities/ProjectTaskStatus.ts

import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Project } from "./project";
import { TaskStatus } from "./taskStatus";

@Entity("project_task_status")
export class ProjectTaskStatus {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Project, (project) => project.projectTaskStatus, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "projectId" })
    project: Project;

    @ManyToOne(() => TaskStatus, (taskStatus) => taskStatus.projectTaskStatus, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "taskStatusId" })
    taskStatus: TaskStatus;
}
