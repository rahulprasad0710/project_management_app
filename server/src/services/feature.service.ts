import { Feature } from "../db/entity/Feature";
import { FeatureTaskStatus } from "../db/entity/FeatureTaskStatus";
import { IActivePagination } from "../types/payload";
import { ILike } from "typeorm";
import { Task } from "../db/entity/task";
import createPagination from "../utils/createPagination";
import dataSource from "../db/data-source";
import { sanitizeEmployeeResult } from "../utils/sanitizeCustomer";

class FeatureService {
    private readonly featureRepository = dataSource.getRepository(Feature);

    async getById(id: number) {
        const result = await this.featureRepository.findOne({
            where: { id },
            relations: ["featureTeamMember", "admin"],
        });
        return {
            ...result,
            featureTeamMember: result?.featureTeamMember?.map((user) => {
                return sanitizeEmployeeResult({ employee: user }) ?? [];
            }),
            admin: result?.admin
                ? sanitizeEmployeeResult({ employee: result?.admin })
                : {},
        };
    }

    async getAll(query: IActivePagination) {
        const { skip, take, isPaginationEnabled, keyword, isActive } = query;
        const [result, totalCount] = await this.featureRepository.findAndCount({
            skip: skip,
            take: take,
            order: {
                id: "DESC",
            },

            where: {
                ...(isActive ? { active: isActive } : {}),
                ...(keyword ? { name: ILike(`%${keyword}%`) } : {}),
            },
        });

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
}

export default FeatureService;
