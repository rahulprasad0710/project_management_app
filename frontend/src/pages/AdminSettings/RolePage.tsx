import {
    useGetAllRolesQuery,
    useLazyGetRoleByIdQuery,
} from "@api/hooks/useRoles";

import Button from "@/components/ui/button/Button";
import type { IRoleResponse } from "@/types/config.types";
import PermissionByRole from "@/components/roles/PermissionByRole";
import { PlusIcon } from "@/icons";
import { useState } from "react";

const Roles = () => {
    const { data: roleList, isFetching } = useGetAllRolesQuery({
        isPaginationEnabled: true,
        page: 1,
        pageSize: 10,
    });
    const [itemIndex, setItemIndex] = useState<number>(1);
    const [selectedRole, setSelectedRole] = useState<IRoleResponse>();

    const [
        fetchDetailsById,
        { isFetching: isFetchingDetails, data: detailsData },
    ] = useLazyGetRoleByIdQuery();

    const handleClick = (index: number, item: IRoleResponse) => {
        setItemIndex(index);
        console.log({
            item,
        });
        setSelectedRole(item);
        fetchDetailsById({
            roleId: item.id,
        });
    };
    //  text-brand-500 dark:bg-brand-400/20 dark:text-brand-400 bg-brand-50
    const btnClassName = ` p-2 px-4 w-full rounded-md bg-gray-100  hover:bg-gray-200 dark:bg-slate-900 dark:text-gray-200 mb-3`;

    return (
        <div className='rounded-md border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]'>
            <div className='px-6 py-5 flex justify-between items-center'>
                <h2 className='text-xl font-semibold text-gray-800 dark:text-white/90'>
                    Roles
                </h2>
                <Button variant='primary' size='sm'>
                    <PlusIcon />
                    Add Role
                </Button>
            </div>
            <div className='grid grid-cols-12 gap-6 px-6 py-5 rounded-xl border border-gray-200 p-6 dark:border-gray-800'>
                <div className='col-span-12 md:col-span-4 lg:col-span-3 dark:bg-slate-800'>
                    <div className="className='w-full mb-6 rounded-2xl border border-gray-200 p-5 lg:p-6 dark:border-gray-800'">
                        {roleList?.data?.result?.map((item, index) => (
                            <button
                                key={index}
                                className={
                                    index === itemIndex
                                        ? `bg-brand-100! ${btnClassName} menu-dropdown-item-active dark:bg-slate-950! dark:text-brand-600! `
                                        : `${btnClassName} menu-dropdown-item-inactive`
                                }
                                onClick={() => handleClick(index, item)}
                            >
                                {item.name}
                            </button>
                        ))}
                    </div>
                </div>
                <div className='col-span-12 md:col-span-8 lg:col-span-9 dark:bg-slate-800'>
                    <PermissionByRole
                        permissionListOfSelectedRole={
                            detailsData?.data?.permissions
                        }
                    />
                </div>
            </div>
        </div>
    );
};

export default Roles;
