import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Permission } from "./Permission";

@Entity()
export class PermissionGroup {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    displayName: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ unique: true })
    description: string;

    @OneToMany(() => Permission, (permission) => permission.permissionGroup)
    permissions: Permission[];
}
