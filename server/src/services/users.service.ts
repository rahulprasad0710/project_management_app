import APP_CONSTANT from "../constants/AppConfig";
import { EmailService } from "./config/email.service";
import { Feature } from "../db/entity/Feature";
import { IEmployeePagination } from "../types/payload";
import { ILike } from "typeorm";
import { IPagination } from "../types/express";
import { Role } from "../db/entity/role";
import { User } from "../db/entity/User";
import { UserView } from "../db/view/UserView";
import createPagination from "../utils/createPagination";
import crypto from "crypto";
import dataSource from "../db/data-source";
import { sanitizeDBResult } from "../utils/sanitizeDbResult";

const emailService = new EmailService();

interface IUser {
    firstName: string;
    lastName: string;
    role: Role;
    email: string;
    mobileNumber: string;
}

export class UserService {
    constructor(
        private readonly userRepository = dataSource.getRepository(User),
        private readonly userViewRepository = dataSource.getRepository(
            UserView
        ),
        private readonly featureRepository = dataSource.getRepository(Feature)
    ) {}

    async create(user: IUser) {
        const generateVerificationToken = () =>
            crypto.randomBytes(32).toString("hex");

        const token = generateVerificationToken();

        const employeeId = await this.generateEmployeeId();

        const response = await this.addUser(user, employeeId, token);

        const verifyLink = `${APP_CONSTANT.FRONTEND_BASE_URL}auth/verify-email/${response.id}?token=${token}`;

        const emailResponse = await emailService.sendVerificationEmail(
            response,
            verifyLink
        );

        return {
            ...response,
            verifyLink: emailResponse,
        };
    }

    async addUser(user: IUser, employeeId: string, verifyEmailToken: string) {
        const userObj = new User();
        userObj.firstName = user.firstName;
        userObj.lastName = user.lastName;
        userObj.email = user.email;
        userObj.emailVerified = false;
        userObj.mobileNumber = user.mobileNumber;
        userObj.role = user.role;
        userObj.employeeId = employeeId;
        userObj.verifyEmailToken = verifyEmailToken;
        const response = await this.userRepository.save(userObj);
        return response;
    }

    async getAll(query: IPagination) {
        const { skip, take, isPaginationEnabled, keyword } = query;
        console.log("getAll");
        let whereClause = {};
        if (keyword) {
            whereClause = [
                { ...whereClause, firstName: ILike(`%${keyword}%`) },
                { ...whereClause, lastName: ILike(`%${keyword}%`) },
                { ...whereClause, employeeId: ILike(`%${keyword}%`) },
                { ...whereClause, mobileNumber: ILike(`%${keyword}%`) },
            ];
        }

        const result = await this.userViewRepository.find({
            skip: skip,
            take: take,
            order: {
                id: "DESC",
            },
            where: whereClause,
        });
        const totalCount = await this.userRepository.count();
        return {
            result,
            pagination: createPagination(
                skip,
                take,
                totalCount,
                isPaginationEnabled
            ),
        };
    }

    async getAllEmployee(query: IEmployeePagination) {
        console.log("getAllEmployeefff");

        const {
            skip,
            take,
            isPaginationEnabled,
            isActive,
            keyword,
            emailVerified,
        } = query;

        console.log({
            skip,
            take,
            isPaginationEnabled,
            isActive,
            keyword,
            emailVerified,
        });

        const result = await this.userRepository.find({
            select: [
                "id",
                "email",
                "firstName",
                "lastName",
                "employeeId",
                "profilePictureUrl",
                "isActive",
                "emailVerified",
                "mobileNumber",
                "createdAt",
                "emailVerified",
                "roleId",
            ],
            skip: skip,
            take: take,
            order: {
                id: "DESC",
            },

            where: {
                ...(keyword ? { firstName: ILike(`%${keyword}%`) } : {}),
                ...(keyword ? { lastName: ILike(`%${keyword}%`) } : {}),
                ...(keyword ? { employeeId: ILike(`%${keyword}%`) } : {}),
                ...(isActive ? { isActive: isActive } : {}),
                ...(emailVerified ? { emailVerified: emailVerified } : {}),
            },
        });
        const totalCount = await this.userRepository.count();
        return {
            result,
            pagination: createPagination(
                skip,
                take,
                totalCount,
                isPaginationEnabled
            ),
        };
    }

    async getByEmail(email: string) {
        const response = await this.userRepository.findOne({
            where: { email: email },
        });
        return response;
    }

    async getById(id: number) {
        const response = await this.userRepository.findOne({
            where: { id: id },
        });
        return response;
    }

    async generateEmployeeId() {
        const [response] = await this.userRepository.find({
            order: { id: "DESC" },
            take: 1,
        });
        const randomNumber = Math.floor(Math.random() * 10000);
        const newEmployeeId = `${APP_CONSTANT.COMPANY_NAME}-${
            response?.id ?? randomNumber + 1
        }`;

        return newEmployeeId;
    }

    async confirmUser({
        password,
        userId,
    }: {
        password: string;
        userId: number;
    }) {
        console.log({
            password,
            userId,
        });

        const response = await this.userRepository.update(userId, {
            password: password,
            verifyEmailToken: () => "NULL",
            emailVerified: true,
            isActive: true,
        });
        return response;
    }

    async getEmployeeViewByProjectId({ featureId }: { featureId: number }) {
        return await this.featureRepository.findOne({
            where: { id: featureId },
            relations: ["featureTeamMember"],
        });
    }

    async getEmployeeViewByFeatureId({ featureId }: { featureId: number }) {
        const result = await this.featureRepository.findOne({
            where: { id: featureId },
            relations: ["featureTeamMember"],
            select: ["id", "featureTeamMember"],
        });

        const response = sanitizeDBResult<
            User,
            | "id"
            | "firstName"
            | "lastName"
            | "email"
            | "mobileNumber"
            | "profilePictureUrl"
            | "role"
        >({
            selectFields: [
                "id",
                "firstName",
                "lastName",
                "email",
                "mobileNumber",
                "profilePictureUrl",
                "role",
            ],
            result: result?.featureTeamMember ?? [],
        });

        return response;
    }

    async updateRefreshToken(userId: number, refreshToken?: string) {
        const response = await this.userRepository.update(userId, {
            refreshToken: refreshToken ? refreshToken : () => "NULL",
        });
        return response;
    }
}

export default UserService;
