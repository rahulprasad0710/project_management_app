import { Mail, MailCheck, MailX, PlusIcon, Trash } from "lucide-react";
import { useEffect, useState } from "react";

import AlertModal from "@/modal/AlertModal";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/button/Button";
import EmployeeModal from "@/modal/EmployeeModal";
import type { IEmployeeResponse } from "@/types/config.types";
import { Modal } from "@/components/common/Modal";
import ReactTable from "@/components/common/ReactTable";
import SearchBar from "@/components/molecules/SearchBar";
import { SquarePen } from "lucide-react";
import Switch from "@/components/form/switch/Switch";
import { createColumnHelper } from "@tanstack/react-table";
import { useLazyGetEmployeesQuery } from "@api/hooks/useEmployee";

const EmployeePage = () => {
    const [selectedData, setSelectedData] = useState<
        undefined | IEmployeeResponse
    >();

    const [isActive, setIsActive] = useState<boolean>(true);
    const [keyword, setKeyword] = useState<string>("");
    const [toggle, setToggle] = useState(false);
    const [toggleDeactivate, setToggleDeactivate] = useState(false);

    const [fetchAll, { isFetching, data: dataList }] =
        useLazyGetEmployeesQuery();

    useEffect(() => {
        fetchAll({
            isPaginationEnabled: true,
            page: 1,
            pageSize: 10,
            isActive: isActive,
            keyword: keyword,
        });
    }, [isActive]);

    const handleSearch = () => {
        fetchAll({
            isPaginationEnabled: true,
            page: 1,
            pageSize: 10,
            isActive: isActive,
            keyword: keyword,
        });
    };

    const handleClearFilter = () => {
        setKeyword("");
        fetchAll({
            isPaginationEnabled: true,
            page: 1,
            pageSize: 10,
            isActive: isActive,
            keyword: "",
        });
    };

    const handlePrevious = () => {
        if (
            !dataList?.data?.pagination?.currentPage ||
            dataList?.data?.pagination?.currentPage === 1
        )
            return;

        fetchAll({
            isPaginationEnabled: true,
            page: dataList?.data?.pagination?.currentPage - 1,
            pageSize: dataList?.data?.pagination?.pageSize,
            keyword: "",
            isActive: true,
        });
    };

    const handleNext = () => {
        if (!dataList?.data?.pagination?.currentPage) return;

        fetchAll(
            {
                isPaginationEnabled: true,
                page: dataList?.data?.pagination?.currentPage + 1,
                pageSize: dataList?.data?.pagination?.pageSize,
                isActive: true,
            },
            true
        );
    };

    const handleEdit = (data: IEmployeeResponse) => {
        setSelectedData(data);
        setToggle(true);
    };

    const handleOpenModal = () => {
        setToggle(true);
    };

    const handleCloseModal = () => {
        setSelectedData(undefined);
        setToggle(false);
    };

    const columnHelper = createColumnHelper<IEmployeeResponse>();

    const columns = [
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

        columnHelper.accessor((row) => row.emailVerified, {
            id: "emailVerified",
            cell: (info) => (
                <div className='font-semibold py-1 px-4'>
                    {info.renderValue() ? (
                        <div className='flex gap-1 items-center'>
                            <MailCheck className='text-green-500' />
                            <Badge badgeType='success' title={"Verified"} />
                        </div>
                    ) : (
                        <div className='flex gap-1 items-center'>
                            <MailX className='text-error-500' />
                            <Badge badgeType='error' title='Not Verified' />
                        </div>
                    )}
                </div>
            ),
            header: () => (
                <div
                    style={{
                        width: "120px",
                    }}
                >
                    Email Verified
                </div>
            ),
        }),

        columnHelper.accessor((row) => row.id, {
            id: "action",
            cell: (info) => {
                return (
                    <div className='flex  gap-4 '>
                        <Button
                            size='sm'
                            variant='secondary'
                            onClick={() => handleEdit(info.row.original)}
                        >
                            <SquarePen className='h-5 w-5 text-brand-400' />
                            <span>Edit</span>
                        </Button>

                        {info.row?.original?.isActive && (
                            <Button
                                size='sm'
                                variant='primary'
                                onClick={() => setToggleDeactivate(true)}
                                className='bg-red-500! hover:bg-red-600!'
                            >
                                <Trash className='h-5 w-5 text-white' />
                                <span>Deactivate Employee</span>
                            </Button>
                        )}

                        {!info.row?.original?.emailVerified && (
                            <Button size='sm' variant='primary'>
                                <Mail className='h-5 w-5 text-white' />
                                <span>Send Verification Email</span>
                            </Button>
                        )}
                    </div>
                );
            },
            header: () => <span className='text-center'>Action</span>,
        }),
    ];

    return (
        <div>
            <div className='rounded-md border border-gray-200 bg-white dark:border-gray-800 dark:bg-slate-800'>
                <div className='flex flex-col justify-end md:justify-between gap-5 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center dark:border-gray-700'>
                    <div>
                        <h3 className='text-lg font-semibold text-gray-800 dark:text-white/90'>
                            Employee Details
                        </h3>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                            Track your task progress of booking service.
                        </p>
                    </div>
                    <Button
                        onClick={handleOpenModal}
                        variant='primary'
                        size='sm'
                    >
                        <PlusIcon />
                        Add Employee
                    </Button>
                </div>

                <div className='border-b border-gray-200 px-5 py-4 dark:border-gray-800'>
                    <div className='flex items-center  justify-end  gap-2 md:gap-4 flex-wrap'>
                        <Switch
                            onChange={() => {
                                setIsActive(!isActive);
                                handleSearch();
                            }}
                            label='Active'
                            defaultChecked={isActive}
                        />

                        <SearchBar
                            setKeyword={setKeyword}
                            keyword={keyword}
                            onClose={() => handleClearFilter()}
                        />

                        <Button
                            variant='outline'
                            size='xs'
                            onClick={handleSearch}
                            type='button'
                        >
                            Search
                        </Button>
                    </div>
                </div>

                <div className='border-t border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-slate-900 sm:p-6'>
                    <ReactTable
                        isFetching={isFetching}
                        showPagination={true}
                        columns={columns ?? []}
                        handleNext={handleNext}
                        handlePrevious={handlePrevious}
                        data={dataList?.data.result ?? []}
                        pagination={
                            dataList?.data?.pagination ?? {
                                currentPage: 1,
                                pageSize: 10,
                                totalCount: 10,
                                totalPages: 1,
                            }
                        }
                    />
                </div>
            </div>
            <Modal
                isOpen={toggle}
                onClose={() => handleCloseModal()}
                className='max-w-[700px] mb-4  '
                isFullscreen={false}
            >
                <EmployeeModal
                    setSelectedData={setSelectedData}
                    selectedData={selectedData}
                    handleCloseModal={handleCloseModal}
                />
            </Modal>
            <Modal
                blurEffect='8px'
                isOpen={toggleDeactivate}
                onClose={() => setToggleDeactivate(false)}
                className='max-w-[700px] mb-4  '
                isFullscreen={false}
            >
                <AlertModal
                    heading='Deactivate Employee'
                    description='Employee will be logout and removed from app until activated back.'
                    btnText='Deactivate'
                    alertType='DANGER'
                    dataInfo={`EmployeeId : PMA-0001   Email ID: rahulstart@example.com `}
                />
            </Modal>
        </div>
    );
};

export default EmployeePage;
