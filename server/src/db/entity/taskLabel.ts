import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { User } from "./User";

@Entity()
export class Label {
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
