import type {
    IEmployeeResponse,
    IFeatureDetailsResponse,
    IFeatureResponse,
} from "@/types/config.types";
import { useEffect, useState } from "react";
import {
    useGetFeaturesQuery,
    useLazyGetFeaturesByIdQuery,
} from "@api/hooks/useFeature";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/button/Button";
import FeatureModal from "@/modal/FeatureModal";
import { Modal } from "@/components/common/Modal";
import ReactTable from "@/components/common/ReactTable";
import { createColumnHelper } from "@tanstack/react-table";

interface IEmployeeResponseTable extends IEmployeeResponse {
    memberType: string;
}

const FeaturePage = () => {
    const [tableData, setTableData] = useState<IEmployeeResponseTable[]>([]);
    const [selectedData, setSelectedData] = useState<IFeatureDetailsResponse>();
    const { data: roleList } = useGetFeaturesQuery({
        isPaginationEnabled: true,
        page: 1,
        pageSize: 10,
        isActive: true,
    });
    const [itemIndex, setItemIndex] = useState<number>(1);
    const [toggle, setToggle] = useState(false);

    useEffect(() => {
        if (roleList?.data?.result?.length && roleList?.data?.result[0]?.id) {
            fetchDetailsById({
                payloadId: roleList?.data?.result[0]?.id,
            });
        }
    }, [roleList]);

    const [fetchDetailsById, { data: detailsData }] =
        useLazyGetFeaturesByIdQuery();

    const handleClick = (index: number, item: IFeatureResponse) => {
        setItemIndex(index);
        fetchDetailsById({
            payloadId: item.id,
        });
    };

    const handleEdit = (item: IFeatureDetailsResponse) => {
        setSelectedData(item);
        setToggle(true);
    };

    useEffect(() => {
        if (detailsData) {
            const adminData = detailsData?.data?.admin;
            const memberData = detailsData?.data?.featureTeamMember?.map(
                (item) => {
                    return {
                        ...item,
                        memberType: "MEMBER",
                    };
                }
            );
            setTableData([
                {
                    ...adminData,
                    memberType: "ADMIN",
                },
                ...memberData,
            ]);
        }
    }, [detailsData]);

    const columnHelper = createColumnHelper<IEmployeeResponseTable>();

    const columns = [
        columnHelper.accessor((row) => row.memberType, {
            id: "memberType",
            cell: (info) => (
                <div className='font-semibold text-gray-700 dark:text-slate-100'>
                    {info.renderValue() === "ADMIN" ? (
                        <Badge title='Admin' badgeType='primary' />
                    ) : (
                        <Badge title='Member' badgeType='success' />
                    )}
                </div>
            ),
            header: () => <div>Member Type</div>,
        }),
        columnHelper.accessor((row) => row.employeeId, {
            id: "employeeId",
            cell: (info) => (
                <div className='font-semibold text-gray-700 dark:text-slate-100'>
                    {info.renderValue()}
                </div>
            ),
            header: () => <div>Employee ID</div>,
        }),
        columnHelper.accessor((row) => row.id, {
            id: "name",
            cell: (info) => (
                <div className='font-semibold text-gray-700 dark:text-slate-100'>
                    {info.row.original.firstName} {info.row.original.lastName}
                </div>
            ),
            header: () => <span>First Name</span>,
        }),
        columnHelper.accessor((row) => row.email, {
            id: "email",
            cell: (info) => (
                <div className='font-semibold text-gray-700 dark:text-slate-100'>
                    {info.renderValue()}
                </div>
            ),
            header: () => <span>Email</span>,
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
    const handleCloseModal = () => {
        setSelectedData(undefined);
        setToggle(false);
    };
    const btnClassName = `bg-gray-100 p-2 px-4 w-full rounded-md hover:bg-gray-200 dark:bg-slate-900 dark:text-gray-200`;

    return (
        <div>
            <div className='rounded-md border border-gray-200 bg-white dark:border-gray-800 dark:bg-slate-900'>
                <div className='grid grid-cols-12 gap-6 px-6 py-5'>
                    <div className='col-span-12 md:col-span-4 lg:col-span-3 dark:bg-slate-800'>
                        <div className='w-full mb-6 rounded-2xl border border-gray-200 p-5 lg:p-6 dark:border-gray-800'>
                            <h2 className='text-xl  text-center bg-amber-200 font-semibold text-gray-800 dark:text-gray-200 dark:bg-slate-900 mb-4 p-2 rounded shadow'>
                                Features
                            </h2>
                            {roleList?.data?.result?.map((item, index) => (
                                <button
                                    key={index}
                                    className={
                                        index === itemIndex
                                            ? `${btnClassName} menu-dropdown-item-active`
                                            : btnClassName
                                    }
                                    onClick={() => handleClick(index, item)}
                                >
                                    {item.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className='col-span-12 md:col-span-8 lg:col-span-9 dark:bg-slate-800'>
                        <div className='w-full mb-6 rounded-2xl border border-gray-200 p-5 lg:p-6 dark:border-gray-800'>
                            <div className='flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between mb-6'>
                                <div className='flex w-full flex-col items-center gap-6 xl:flex-row'>
                                    <div className='h-20 w-20 overflow-hidden rounded-full border border-gray-200 dark:border-gray-800'>
                                        <img
                                            src={
                                                detailsData?.data
                                                    ?.profilePictureResponse
                                                    ?.url
                                            }
                                            alt='user'
                                        />
                                    </div>
                                    <div className='order-3 xl:order-2'>
                                        <h4 className=' text-center text-lg font-semibold text-gray-800 xl:text-left dark:text-white/90'>
                                            {detailsData?.data?.name}
                                            {detailsData?.data?.active ? (
                                                <Badge
                                                    title='Active'
                                                    badgeType='success'
                                                />
                                            ) : (
                                                <Badge
                                                    title='Inactive'
                                                    badgeType='error'
                                                />
                                            )}
                                        </h4>
                                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                                            {detailsData?.data?.description}{" "}
                                        </p>
                                        <p className='text-md text-gray-800 dark:text-gray-400'>
                                            {
                                                detailsData?.data
                                                    ?.internalCompany?.name
                                            }
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant='primary'
                                    onClick={() => {
                                        if (!detailsData?.data) {
                                            return;
                                        }
                                        handleEdit(detailsData?.data);
                                    }}
                                    size='xs'
                                >
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
                                </Button>
                            </div>

                            <div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between'>
                                <div className='w-full'>
                                    <h4 className='text-lg font-semibold text-gray-800 lg:mb-2 dark:text-white/90'>
                                        Members Information
                                    </h4>
                                </div>
                            </div>

                            <div className='w-full my-6'>
                                <ReactTable
                                    showPagination={false}
                                    columns={columns}
                                    isFetching={false}
                                    pagination={{
                                        currentPage: 1,
                                        pageSize: 10,
                                        totalCount:
                                            detailsData?.data?.featureTeamMember
                                                ?.length ?? 0,
                                        totalPages: 1,
                                    }}
                                    data={tableData}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={toggle}
                onClose={() => handleCloseModal()}
                className='max-w-[700px] mb-4  '
                isFullscreen={false}
            >
                <FeatureModal
                    setSelectedData={setSelectedData}
                    selectedData={selectedData}
                    handleCloseModal={handleCloseModal}
                />
            </Modal>
        </div>
    );
};

export default FeaturePage;
