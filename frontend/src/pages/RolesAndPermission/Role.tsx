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

    const inActiveClassName =
        "inline-flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 ease-in-out sm:p-3 bg-transparent text-gray-500 border-transparent hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200";
    const activeClassName =
        "py-2.5å inline-flex items-center rounded-lg px-3 text-sm font-medium transition-colors duration-200 ease-in-out sm:p-3 text-brand-500 dark:bg-brand-400/20 dark:text-brand-400 bg-brand-50";

    return (
        <div>
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
                <div className='border-t border-gray-100 p-4 dark:border-gray-800 sm:p-6'>
                    <div className='rounded-xl border border-gray-200 p-6 dark:border-gray-800'>
                        <div className='flex flex-col gap-6 sm:flex-row sm:gap-8'>
                            <div className='overflow-x-auto pb-2 sm:w-[200px] [&amp;::-webkit-scrollbar-thumb]:rounded-full [&amp;::-webkit-scrollbar-thumb]:bg-gray-100 dark:[&amp;::-webkit-scrollbar-thumb]:bg-gray-600 [&amp;::-webkit-scrollbar-track]:bg-white dark:[&amp;::-webkit-scrollbar-track]:bg-transparent [&amp;::-webkit-scrollbar]:h-1.5'>
                                <nav className='flex w-full flex-row sm:flex-col sm:space-y-2'>
                                    {roleList?.data?.result?.map(
                                        (item, index) => (
                                            <button
                                                key={index}
                                                className={
                                                    index === itemIndex
                                                        ? activeClassName
                                                        : inActiveClassName
                                                }
                                                onClick={() =>
                                                    handleClick(index, item)
                                                }
                                            >
                                                {item.name}
                                            </button>
                                        )
                                    )}
                                </nav>
                            </div>
                            <div className='flex-1'>
                                <PermissionByRole
                                    permissionListOfSelectedRole={
                                        detailsData?.data?.permissions
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Roles;
