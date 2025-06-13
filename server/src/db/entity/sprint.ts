import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { User } from "./User";

@Entity()
export class Sprint {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: "text", nullable: true })
    goal: string;

    @Column({ type: "date" })
    startDate: Date;

    @Column({ type: "date" })
    endDate: Date;

    @Column({ default: true })
    isActive: boolean;

    @Column()
    addedAt: Date;

    @ManyToOne(() => User, (user) => user.id)
    addedBy: User;
}
