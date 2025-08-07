import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

import { Feature } from "./Feature";
import { Project } from "./project";
import { User } from "./User";

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

    @OneToMany(() => Feature, (feature) => feature.internalCompany)
    features: Feature[];

    @ManyToMany(() => User, (user) => user.id, {
        cascade: true,
        eager: true,
    })
    @JoinTable({
        name: "internal_company_member",
        joinColumn: {
            name: "internal_company_id",
            referencedColumnName: "id",
        },
        inverseJoinColumn: {
            name: "user_id",
            referencedColumnName: "id",
        },
    })
    internalCompanyTeamMember: User[];
}
