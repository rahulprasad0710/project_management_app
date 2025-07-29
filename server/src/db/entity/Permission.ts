import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { PermissionGroup } from "./PermissionGroup";

@Entity()
export class Permission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    displayName: string;

    @Column()
    enumName: string;

    @ManyToOne(() => PermissionGroup, (permission) => permission.id)
    permissionGroup: PermissionGroup;

    @Column({ default: true })
    isActive: boolean;

    @Column({ unique: true })
    description: string;
}
