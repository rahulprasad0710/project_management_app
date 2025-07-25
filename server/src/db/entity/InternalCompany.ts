import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

import { Project } from "./project";

@Entity()
export class InternalCompany {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", unique: true })
    name: string;

    @Column({ type: "varchar", unique: true })
    slug: string;

    @Column({ type: "varchar", nullable: true })
    logoUrl: string;

    @Column({ type: "varchar", nullable: true })
    address: string;

    @Column({ type: "varchar", nullable: true })
    contactEmail: string;

    @Column({ type: "varchar", nullable: true })
    contactPhone: string;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Project, (project) => project.internalCompany)
    projects: Project[];
}
