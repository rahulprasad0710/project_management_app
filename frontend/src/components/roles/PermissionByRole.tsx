import type {
    IPermissionGroupResponse,
    IPermissionResponse,
} from "@/types/config.types";
import {
    useGetAllPermissionGroupsQuery,
    useLazyGetPermissionGroupsDetailsByIdQuery,
} from "@apiHooks/usePermission";

import Skeleton from "@/components/common/Skeleton";
import { TrashBinIcon } from "@/icons";
import { useState } from "react";

type Props = {
    permissionListOfSelectedRole: IPermissionResponse[] | undefined;
};

const PermissionByRole = ({ permissionListOfSelectedRole }: Props) => {
    const { data: PermissionGroups, isFetching } =
        useGetAllPermissionGroupsQuery({
            isPaginationEnabled: true,
            page: 1,
            pageSize: 10,
            isActive: true,
        });

    console.log({
        permissionListOfSelectedRole,
    });

    const [
        fetchDetailsById,
        { isFetching: isFetchingDetails, data: PermissionGroupDetails },
    ] = useLazyGetPermissionGroupsDetailsByIdQuery();

    const [itemIndex, setItemIndex] = useState<number>(1);

    const handleClick = (index: number, item: IPermissionGroupResponse) => {
        setItemIndex(index);
        console.log({
            item,
        });
        fetchDetailsById({
            permissionGroupId: item.id,
        });
    };

    const activeClassName =
        "inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 ease-in-out bg-white text-gray-900 shadow-theme-xs dark:bg-white/[0.03] dark:text-white";

    const inactiveClassName =
        "inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 ease-in-out bg-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200";

    return (
        <>
            <div className='rounded-t-md border border-gray-200 p-3 dark:border-gray-800'>
                <nav className='flex gap-2 overflow-x-auto rounded-lg bg-gray-100 p-1 dark:bg-gray-900 [&amp;::-webkit-scrollbar-thumb]:rounded-full [&amp;::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&amp;::-webkit-scrollbar-thumb]:bg-gray-600 [&amp;::-webkit-scrollbar-track]:bg-white dark:[&amp;::-webkit-scrollbar-track]:bg-transparent [&amp;::-webkit-scrollbar]:h-1.5'>
                    {isFetching
                        ? Array.from({ length: 8 }).map((_, index) => (
                              <Skeleton
                                  key={index}
                                  className=' h-6 w-24 mr-8 bg-white dark:bg-white/[0.03]'
                                  width='100px'
                                  height='24px'
                              />
                          ))
                        : PermissionGroups?.data.result.map((item, index) => (
                              <button
                                  key={index}
                                  className={
                                      index === itemIndex
                                          ? activeClassName
                                          : inactiveClassName
                                  }
                                  onClick={() => handleClick(index, item)}
                              >
                                  {item.displayName}
                              </button>
                          ))}
                </nav>
            </div>
            <div className='rounded-b-md border border-t-0 border-gray-200 p-6 pt-4 dark:border-gray-800'>
                <div className='border border-t border-gray-200 py-4 mt-4 dark:border-gray-800 sm:p-6 overflow-x-auto'>
                    <table className='min-w-full'>
                        <thead className='border-gray-100 border-y bg-gray-50 dark:border-gray-800 dark:bg-gray-900'>
                            <tr>
                                <th className='px-6 py-3 whitespace-nowrap'>
                                    <div className='flex items-center'>
                                        <p className='font-medium  text-slate-800 text-theme-xs dark:text-gray-400'>
                                            Name
                                        </p>
                                    </div>
                                </th>
                                <th className='px-6 py-3 whitespace-nowrap'>
                                    <div className='flex items-center'>
                                        <p className='font-medium text-gray-500 text-theme-xs dark:text-gray-400'>
                                            Description
                                        </p>
                                    </div>
                                </th>
                                <th className='px-6 py-3 whitespace-nowrap'>
                                    <div className='flex items-center'>
                                        <p className='font-medium text-gray-500 text-theme-xs dark:text-gray-400'>
                                            Status
                                        </p>
                                    </div>
                                </th>
                                <th className='px-6 py-3 whitespace-nowrap'>
                                    <div className='flex items-center justify-center'>
                                        <button className='font-medium text-gray-500 text-theme-xs dark:text-gray-400 '>
                                            Action
                                        </button>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-100 dark:divide-gray-800'>
                            {PermissionGroupDetails?.data.permissions?.map(
                                (item) => (
                                    <tr key={item.id}>
                                        <td className='px-6 py-3 whitespace-nowrap'>
                                            <div className='flex items-center'>
                                                <p className='text-gray-700 text-theme-sm dark:text-gray-400'>
                                                    {item.displayName}
                                                </p>
                                            </div>
                                        </td>
                                        <td className='px-6 py-3 whitespace-nowrap'>
                                            <div className='flex items-center'>
                                                <p className='text-gray-700 text-theme-sm dark:text-gray-400'>
                                                    {item.description}
                                                </p>
                                            </div>
                                        </td>
                                        <td className='px-6 py-3 whitespace-nowrap'>
                                            <div className='flex items-center'>
                                                <p className='bg-success-50 text-theme-xs text-success-600 dark:bg-success-500/15 dark:text-success-500 rounded-full px-2 py-0.5 font-medium'>
                                                    {permissionListOfSelectedRole?.find(
                                                        (permission) =>
                                                            permission.id ===
                                                            item.id
                                                    )
                                                        ? "Applied"
                                                        : "Inactive"}
                                                    {}
                                                </p>
                                            </div>
                                        </td>
                                        <td className='px-6 py-3 whitespace-nowrap'>
                                            <div className='flex items-center justify-center'>
                                                <button className='cursor-pointer hover:text-blue-700'>
                                                    <TrashBinIcon />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default PermissionByRole;
