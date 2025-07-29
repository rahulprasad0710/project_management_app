import { Permission } from "../db/entity/Permission";
import { PermissionGroup } from "../db/entity/PermissionGroup";
import createPagination from "../utils/createPagination";
import dataSource from "../db/data-source";

export class PermissionService {
    constructor(
        private permissionRepository = dataSource.getRepository(Permission),

        private permissionGroupRepository = dataSource.getRepository(
            PermissionGroup
        )
    ) {}

    async getPermissionByPermissionGroupId(groupId: number) {
        const result = await this.permissionGroupRepository.findOne({
            where: { id: groupId },
            relations: ["permissions"],
        });
        return result;
    }

    async getAllPermissionGroups() {
        const result = await this.permissionGroupRepository.find({
            where: { isActive: true },
        });

        return {
            result,
            pagination: createPagination(0, 10, result.length, false),
        };
    }

    async getPermissionById(id: number) {
        return await this.permissionRepository.findOneBy({ id });
    }
}

export default PermissionService;
