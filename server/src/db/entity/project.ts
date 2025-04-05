import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    ManyToMany,
    JoinTable,
} from "typeorm";
import { User } from "./User";
import { Priority, ProjectStatus } from "../../enums/Priority";

@Entity()
export class Project {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column({ nullable: true, default: null })
    profilePicture: string;

    @Column({
        type: "enum",
        enum: ProjectStatus,
        default: ProjectStatus.STARTED,
    })
    status: string;

    @Column({
        type: "enum",
        enum: Priority,
        default: Priority.MEDIUM,
    })
    priority: Priority;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @ManyToOne(() => User, (user) => user.id)
    admin: User;

    @ManyToMany(() => User, (user) => user.id, {
        cascade: true,
        eager: true,
    })
    @JoinTable({
        name: "team_member",
        joinColumn: {
            name: "projectId",
            referencedColumnName: "id",
        },
        inverseJoinColumn: {
            name: "userId",
            referencedColumnName: "id",
        },
    })
    teamMember: User[];
}
