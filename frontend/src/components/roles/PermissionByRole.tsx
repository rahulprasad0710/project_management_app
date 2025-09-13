import type {
    IPermissionGroupResponse,
    IPermissionResponse,
} from "@/types/config.types";
import { useEffect, useState } from "react";
import {
    useGetAllPermissionGroupsQuery,
    useLazyGetPermissionGroupsDetailsByIdQuery,
} from "@apiHooks/usePermission";

import Badge from "../ui/Badge";
import Button from "../ui/button/Button";
import Skeleton from "@/components/common/Skeleton";

type Props = {
    permissionListOfSelectedRole: IPermissionResponse[] | undefined;
};

interface IPermissionResponseWithCheckbox extends IPermissionResponse {
    isChecked: boolean;
}

const PermissionByRole = ({ permissionListOfSelectedRole }: Props) => {
    const [
        permissionListOfSelectedRoleState,
        setPermissionListOfSelectedRoleState,
    ] = useState<IPermissionResponseWithCheckbox[]>([]);

    const [modifiedPermissionState, setModifiedPermissionState] = useState<
        number[]
    >([]);

    useEffect(() => {
        if (
            permissionListOfSelectedRole &&
            permissionListOfSelectedRole?.length > 0
        ) {
            setPermissionListOfSelectedRoleState(
                permissionListOfSelectedRole.map((item) => {
                    return {
                        ...item,
                        isChecked: true,
                    };
                })
            );
        }
    }, [permissionListOfSelectedRole]);

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

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        permissionResponse: IPermissionResponse
    ) => {
        const isPermissionAlreadySelected =
            permissionListOfSelectedRoleState?.find(
                (permission) => permission.id === permissionResponse.id
            );
        if (isPermissionAlreadySelected) {
            const temp = modifiedPermissionState?.filter(
                (item) => item === permissionResponse.id
            );
            setModifiedPermissionState(temp);

            const tempPermission = permissionListOfSelectedRoleState?.map(
                (item) => {
                    if (item.id == isPermissionAlreadySelected.id) {
                        return {
                            ...item,
                            isChecked: false,
                        };
                    } else {
                        return item;
                    }
                }
            );

            setPermissionListOfSelectedRoleState(tempPermission);
        } else {
            setModifiedPermissionState([
                ...modifiedPermissionState,
                permissionResponse.id,
            ]);

            const temp: IPermissionResponseWithCheckbox = {
                ...permissionResponse,
                isChecked: true,
            };

            const temp2 =
                permissionListOfSelectedRoleState?.length > 0
                    ? permissionListOfSelectedRoleState
                    : [];

            if (permissionListOfSelectedRoleState?.length > 0) {
                setPermissionListOfSelectedRoleState([...temp2, temp]);
            }
        }
    };

    const activeClassName =
        "inline-flex items-center  transition rounded-md px-3 py-1 text-md font-medium transition-colors duration-200 ease-in-out bg-white text-gray-900 shadow-theme-xs dark:bg-white/[0.03] dark:text-white";

    const inactiveClassName =
        "inline-flex items-center transition rounded-md px-3 py-1 text-md font-medium transition-colors duration-200 ease-in-out bg-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200";

    return (
        <div className=' border border-gray-100 rounded-2xl dark:border-gray-800 dark:bg-slate-900 p-4'>
            <div className='flex w-full flex-col items-center gap-6 xl:flex-row mb-6'>
                <div className='order-3 xl:order-2'>
                    <h4 className='mb-2 text-center text-lg font-semibold text-gray-800 xl:text-left dark:text-white/90'>
                        Role
                    </h4>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                        Role Description
                    </p>
                </div>
            </div>
            <nav className='flex gap-2 overflow-x-auto rounded-lg bg-brand-200 p-2 dark:bg-gray-900 [&amp;::-webkit-scrollbar-thumb]:rounded-full [&amp;::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&amp;::-webkit-scrollbar-thumb]:bg-gray-600 [&amp;::-webkit-scrollbar-track]:bg-white dark:[&amp;::-webkit-scrollbar-track]:bg-transparent [&amp;::-webkit-scrollbar]:h-1.5'>
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
            <div className=' p-6 pt-4 dark:border-gray-800'>
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
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-100 dark:divide-gray-800'>
                            {PermissionGroupDetails?.data.permissions?.map(
                                (item) => (
                                    <tr key={item.id}>
                                        <td className='px-6 py-3 whitespace-nowrap'>
                                            <div className='flex items-center'>
                                                <label className='flex items-center gap-2 cursor-pointer mr-4'>
                                                    <input
                                                        type='checkbox'
                                                        className='w-4 h-4'
                                                        onChange={(e) =>
                                                            handleChange(
                                                                e,
                                                                item
                                                            )
                                                        }
                                                        checked={
                                                            permissionListOfSelectedRoleState?.find(
                                                                (permission) =>
                                                                    permission.id ===
                                                                    item.id
                                                            )?.isChecked
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                </label>
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
                                                {permissionListOfSelectedRoleState?.find(
                                                    (permission) =>
                                                        permission.id ===
                                                        item.id
                                                ) ? (
                                                    <Badge
                                                        title='Applied'
                                                        badgeType='success'
                                                    />
                                                ) : (
                                                    <Badge
                                                        title='Not Applied'
                                                        badgeType='warning'
                                                    />
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
                <div className='flex justify-end mt-4'>
                    <Button variant='primary' size='sm' className=''>
                        Apply Changes
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PermissionByRole;
