import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";

import { BaseEntityWithAudit } from "./Audit";
import { Permission } from "./Permission";
import { User } from "./User";

@Entity()
export class Role extends BaseEntityWithAudit {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: true })
    isActive: boolean;

    @Column({ unique: true })
    name: string;

    @OneToMany(() => User, (user) => user.role)
    users: User[];

    @ManyToMany(() => Permission, { cascade: true })
    @JoinTable()
    permissions: Permission[];
}
