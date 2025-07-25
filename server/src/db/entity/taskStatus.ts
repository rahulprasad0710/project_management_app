import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { ProjectTaskStatus } from "./ProjectTaskStatus";

@Entity()
export class TaskStatus {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ type: "text", default: "#023047" })
    colorCode: string;

    @OneToMany(() => ProjectTaskStatus, (pts) => pts.taskStatus)
    projectTaskStatus: ProjectTaskStatus[];
}
