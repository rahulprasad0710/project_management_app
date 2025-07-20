import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { BaseEntityWithAudit } from "./Audit";
import { User } from "./User";

@Entity()
export class Role extends BaseEntityWithAudit {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: "text", nullable: true })
    description: string;

    @Column({ default: true })
    isActive: boolean;

    @Column()
    addedAt: Date;

    @ManyToOne(() => User, (user) => user.id)
    addedBy: User;
}
