import AppError from "../utils/AppError";
import { ErrorType } from "../enums/Eums";
import { Permission } from "../db/entity/Permission";
import { Role } from "../db/entity/role";
import { User } from "../db/entity/User";
import createPagination from "../utils/createPagination";
import dataSource from "../db/data-source";

interface IRole {
    name: string;
    isActive?: boolean;
    permissions?: Permission[];
    addedBy?: User;
}

export class RoleService {
    private readonly roleRepository = dataSource.getRepository(Role);

    async create(role: IRole) {
        const roleObj = new Role();
        roleObj.name = role.name;
        roleObj.isActive = role.isActive ?? true;
        if (role.permissions) {
            roleObj.permissions = role.permissions;
        }

        return await this.roleRepository.save(roleObj);
    }

    async getAll(isActive: boolean) {
        const result = await this.roleRepository.find({
            where: { isActive },
        });
        return {
            result,
            pagination: createPagination(0, 10, result.length, false),
        };
    }

    async getById(id: number) {
        if (!id || isNaN(id)) {
            throw new AppError(
                "Invalid role ID",
                400,
                ErrorType.BAD_REQUEST_ERROR
            );
        }
        const result = await this.roleRepository.findOne({
            where: { id },
            relations: ["permissions", "permissions.permissionGroup"],
        });

        if (!result) {
            throw new AppError(
                "Role not found",
                404,
                ErrorType.NOT_FOUND_ERROR
            );
        }

        return {
            ...result,
            permissions: result.permissions.map((permission) => ({
                id: permission.id,
                displayName: permission.displayName,
                isActive: permission.isActive,
                description: permission.description,
                enumName: permission.enumName,
                permissionGroupId: result.permissions[0].permissionGroup.id,
                permissionGroupName:
                    result.permissions[0].permissionGroup.displayName,
            })),
        };
    }

    async update(id: number, updateFields: Partial<IRole>) {
        const role = await this.roleRepository.findOneBy({ id });
        if (!role) throw new Error("Role not found");

        Object.assign(role, updateFields);
        return await this.roleRepository.save(role);
    }

    async deactivate(id: number, isActive: boolean) {
        const role = await this.roleRepository.findOneBy({ id });
        if (!role) throw new Error("Role not found");

        role.isActive = isActive;
        return await this.roleRepository.save(role);
    }
}

export default RoleService;
