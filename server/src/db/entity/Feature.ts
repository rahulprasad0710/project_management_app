import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";

import { InternalCompany } from "./InternalCompany";
import { User } from "./User";

@Entity()
export class Feature {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    slug: string;

    @Column({ nullable: true, default: null })
    profilePicture: string;

    @ManyToOne(() => InternalCompany, (company) => company.projects, {
        onDelete: "SET NULL",
        nullable: true,
    })
    internalCompany: InternalCompany;

    @ManyToOne(() => User, (user) => user.id)
    admin: User;

    @ManyToMany(() => User, (user) => user.id, {
        cascade: true,
        eager: true,
    })
    @JoinTable({
        name: "feature_team_member",
        joinColumn: {
            name: "feature_id",
            referencedColumnName: "id",
        },
        inverseJoinColumn: {
            name: "user_id",
            referencedColumnName: "id",
        },
    })
    featureTeamMember: User[];
}
