import {
    useGetAllPermissionGroupsQuery,
    useLazyGetPermissionGroupsDetailsByIdQuery,
} from "@/store/api";

import type { IPermissionGroupResponse } from "@/types/config.types";
import Skeleton from "@/components/common/Skeleton";
import { useState } from "react";

const Permission = () => {
    const { data: PermissionGroups, isFetching } =
        useGetAllPermissionGroupsQuery({
            isPaginationEnabled: true,
            page: 1,
            pageSize: 10,
            isActive: true,
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
        <div className='rounded-md border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]'>
            <div className='px-6 py-5'>
                <h2 className='text-xl font-semibold text-gray-800 dark:text-white/90'>
                    Permissions
                </h2>
            </div>
            <div className='border-t border-gray-100 p-4 dark:border-gray-800 sm:p-6'>
                <div x-data="{ activeTab: 'overview' }">
                    <div className='rounded-t-xl border border-gray-200 p-3 dark:border-gray-800'>
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
                                : PermissionGroups?.data.result.map(
                                      (item, index) => (
                                          <button
                                              key={index}
                                              className={
                                                  index === itemIndex
                                                      ? activeClassName
                                                      : inactiveClassName
                                              }
                                              onClick={() =>
                                                  handleClick(index, item)
                                              }
                                          >
                                              {item.displayName}
                                          </button>
                                      )
                                  )}
                        </nav>
                    </div>
                    <div className='rounded-b-xl border border-t-0 border-gray-200 p-6 pt-4 dark:border-gray-800'>
                        <div x-show="activeTab === 'customers'">
                            <h3 className='mb-1 text-xl font-medium text-gray-800 dark:text-white/90'>
                                {PermissionGroupDetails?.data.displayName}
                            </h3>
                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                                {PermissionGroupDetails?.data.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Permission;
