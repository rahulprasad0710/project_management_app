// entities/ProjectTaskStatus.ts

import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Feature } from "./Feature";
import { TaskStatus } from "./taskStatus";

@Entity("feature_task_status")
export class FeatureTaskStatus {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Feature, (feature) => feature.id, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "feature_id" })
    feature: Feature;

    @ManyToOne(() => TaskStatus, (taskStatus) => taskStatus.id, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "task_status_id" })
    taskStatus: TaskStatus;
}
