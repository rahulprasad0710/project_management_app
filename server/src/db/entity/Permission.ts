import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { BaseEntityWithAudit } from "./Audit";

@Entity()
export class Permission extends BaseEntityWithAudit {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ unique: true })
    enumName: string;
}
