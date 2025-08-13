import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";

import { CredentialType } from "../../enums/CredentialType";
import { InternalCompany } from "./InternalCompany";

@Entity()
export class Customer {
    constructor() {
        this.createdAt = new Date();
        this.isActive = false;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ type: "varchar", default: "0000-00-00" })
    mobileNumber: string;

    @Column({
        type: "enum",
        enum: CredentialType,
        nullable: false,
    })
    CredentialType: CredentialType;

    @Column()
    associated_internal_company_id: number;

    @ManyToOne(() => InternalCompany, { eager: false })
    @JoinColumn({ name: "associated_internal_company_id" })
    role: InternalCompany;

    @Column({ default: false })
    emailVerified: boolean;

    @Column()
    isActive: boolean;

    @Column()
    createdAt: Date;

    @Column({ nullable: true })
    profilePictureUrl: string;

    @Column({ nullable: true })
    password: string;

    @Column({ nullable: true })
    refreshToken: string;

    @Column({ nullable: true })
    verifyEmailToken: string;
}
