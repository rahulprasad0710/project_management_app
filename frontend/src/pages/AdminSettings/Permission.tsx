import type {
    IPermissionGroupResponse,
    IPermissionResponse,
} from "@/types/config.types";
import { useEffect, useState } from "react";
import {
    useGetAllPermissionGroupsQuery,
    useLazyGetPermissionGroupsDetailsByIdQuery,
} from "@apiHooks/usePermission";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/button/Button";
import ReactTable from "@/components/common/ReactTable";
import Skeleton from "@/components/common/Skeleton";
import { createColumnHelper } from "@tanstack/react-table";

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
        { isFetching: isFetchingDetails, data: permissionGroupDetails },
    ] = useLazyGetPermissionGroupsDetailsByIdQuery();

    const [itemIndex, setItemIndex] = useState<number>(0);

    const handleClick = (index: number, item: IPermissionGroupResponse) => {
        setItemIndex(index);
        console.log({
            item,
        });
        fetchDetailsById({
            permissionGroupId: item.id,
        });
    };

    useEffect(() => {
        if (
            PermissionGroups?.data?.result?.length &&
            PermissionGroups?.data?.result[0]?.id
        ) {
            setItemIndex(0);
            fetchDetailsById({
                permissionGroupId: PermissionGroups?.data?.result[0]?.id,
            });
        }
    }, [
        PermissionGroups?.data?.result,
        PermissionGroups?.data?.result?.length,
        fetchDetailsById,
    ]);

    const columnHelper = createColumnHelper<IPermissionResponse>();

    const columns = [
        columnHelper.accessor((row) => row.displayName, {
            id: "displayName",
            cell: (info) => (
                <div className='font-semibold text-gray-700 dark:text-slate-100'>
                    {info.renderValue()}
                </div>
            ),
            header: () => <div>Permission Name</div>,
        }),

        columnHelper.accessor((row) => row.description, {
            id: "description",
            cell: (info) => (
                <p className='font-normal text-gray-700 dark:text-slate-100'>
                    {info.renderValue()}
                </p>
            ),
            header: () => <div>Description</div>,
        }),

        columnHelper.accessor((row) => row.isActive, {
            id: "is_active",
            cell: (info) => (
                <div
                    style={{
                        width: "120px",
                    }}
                    className='font-semibold py-1 px-4'
                >
                    {info.renderValue() ? (
                        <Badge badgeType='success' title='Active' />
                    ) : (
                        <Badge badgeType='error' title='Inactive' />
                    )}
                </div>
            ),
            header: () => <div>Status</div>,
        }),
    ];

    const btnClassName = `bg-gray-100 p-2 px-4 w-full rounded-md  hover:bg-gray-200 dark:bg-slate-900 dark:text-gray-200 mb-3`;

    return (
        <div>
            <div className='rounded-md border border-gray-200 bg-white dark:border-gray-800 dark:bg-slate-900'>
                <div className='grid grid-cols-12 gap-6 px-6 py-5'>
                    <div className='col-span-12 md:col-span-4 lg:col-span-3 dark:bg-slate-800'>
                        <div className='w-full mb-6 rounded-2xl border border-gray-200 p-5 lg:p-6 dark:border-gray-800'>
                            <h2 className='text-xl  text-center bg-amber-200 font-semibold text-gray-800 dark:text-gray-200 dark:bg-slate-900 mb-4 p-2 rounded shadow'>
                                Permissions
                            </h2>
                            {PermissionGroups?.data?.result?.map(
                                (item, index) => (
                                    <button
                                        key={index}
                                        className={
                                            index === itemIndex
                                                ? btnClassName
                                                : btnClassName
                                        }
                                        onClick={() => handleClick(index, item)}
                                    >
                                        {item.displayName}
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                    <div className='col-span-12 md:col-span-8 lg:col-span-9 dark:bg-slate-800'>
                        <div className='w-full mb-6 rounded-2xl border border-gray-200 p-5 lg:p-6 dark:border-gray-800'>
                            <div className='flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between mb-6'>
                                <div className='flex w-full flex-col items-center gap-6 xl:flex-row'>
                                    <div className='order-3 xl:order-2'>
                                        <h4 className='mb-2 text-center text-lg font-semibold text-gray-800 xl:text-left dark:text-white/90'>
                                            {
                                                permissionGroupDetails?.data
                                                    ?.displayName
                                            }{" "}
                                            Permissions
                                        </h4>
                                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                                            {
                                                permissionGroupDetails?.data
                                                    ?.description
                                            }
                                        </p>
                                    </div>
                                </div>
                                {/* <Button variant='primary' size='xs'>
                                    <svg
                                        className='fill-current'
                                        width={18}
                                        height={18}
                                        viewBox='0 0 18 18'
                                        fill='none'
                                        xmlns='http://www.w3.org/2000/svg'
                                    >
                                        <path
                                            fillRule='evenodd'
                                            clipRule='evenodd'
                                            d='M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z'
                                            fill=''
                                        />
                                    </svg>
                                    Edit
                                </Button> */}
                            </div>
                            {isFetchingDetails ? (
                                Array.from({ length: 8 }).map((_, index) => (
                                    <Skeleton
                                        key={index}
                                        className=' h-6 w-24 mr-8 bg-white dark:bg-white/[0.03]'
                                        width='100px'
                                        height='24px'
                                    />
                                ))
                            ) : (
                                <div className='w-full my-6'>
                                    <ReactTable
                                        showPagination={false}
                                        columns={columns}
                                        isFetching={isFetchingDetails}
                                        pagination={{
                                            currentPage: 1,
                                            pageSize: 10,
                                            totalCount:
                                                permissionGroupDetails?.data
                                                    ?.permissions?.length ?? 0,
                                            totalPages: 1,
                                        }}
                                        data={
                                            permissionGroupDetails?.data
                                                ?.permissions ?? []
                                        }
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Permission;
