import type {
    ITaskStatusResponse,
    ResponseWithPagination,
} from "@/types/config.types";
import { useEffect, useState } from "react";
import {
    useGetAllTaskStatusQuery,
    useLazyGetAllTaskStatusQuery,
} from "@api/hooks/useTaskStatus";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { Modal } from "@/components/common/Modal";
import { PlusIcon } from "lucide-react";
import ReactTable from "@/components/common/ReactTable";
import { SquarePen } from "lucide-react";
import TaskStatusModal from "@/components/settings/TaskStatusModal";
import { createColumnHelper } from "@tanstack/react-table";

const TaskStatus = () => {
    const [keyword, setKeyword] = useState<string>("");
    const [selectedData, setSelectedData] = useState<
        undefined | ITaskStatusResponse
    >();
    const [toggle, setToggle] = useState(false);

    const [fetchAll, { isFetching, data: dataList }] =
        useLazyGetAllTaskStatusQuery();

    console.log({
        dataList,
    });

    useEffect(() => {
        fetchAll({
            isPaginationEnabled: true,
            page: 1,
            pageSize: 10,
        });
    }, [fetchAll]);

    const handleSearch = () => {
        fetchAll({
            isPaginationEnabled: true,
            page: 1,
            pageSize: 10,
            keyword: keyword,
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
            keyword: keyword,
        });
    };

    const handleNext = () => {
        if (!dataList?.data?.pagination?.currentPage) return;

        fetchAll(
            {
                isPaginationEnabled: true,
                page: dataList?.data?.pagination?.currentPage + 1,
                pageSize: dataList?.data?.pagination?.pageSize,
                keyword: keyword,
            },
            true
        );
    };

    const handleEdit = (data: ITaskStatusResponse) => {
        setSelectedData(data);
        setToggle(true);
    };

    const handleOpenModal = () => {
        setToggle(true);
    };

    const columnHelper = createColumnHelper<ITaskStatusResponse>();

    const columns = [
        columnHelper.accessor((row) => row.name, {
            id: "name",
            cell: (info) => (
                <div className='font-semibold text-blue-950'>
                    {info.renderValue()}
                </div>
            ),
            header: () => <span>Title</span>,
        }),

        columnHelper.accessor((row) => row.color_code, {
            id: "color_code",
            cell: (info) => (
                <div
                    style={{
                        backgroundColor: info.getValue(),
                        width: "120px",
                    }}
                    className='font-semibold text-white text-center py-1 px-4'
                >
                    {info.renderValue()}
                </div>
            ),
            header: () => <span>Color code</span>,
        }),
        columnHelper.accessor((row) => row.is_active, {
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
            header: () => (
                <div
                    style={{
                        width: "120px",
                    }}
                >
                    Status
                </div>
            ),
        }),

        columnHelper.accessor((row) => row.id, {
            id: "action",
            cell: (info) => (
                <div className='flex items-center gap-4'>
                    <Button
                        size='sm'
                        variant='outline'
                        onClick={() => handleEdit(info.row.original)}
                    >
                        <SquarePen className='h-5 w-5 text-blue-400' />
                        <span>Edit</span>
                    </Button>
                </div>
            ),
            header: () => <span>Action</span>,
        }),
    ];

    return (
        <div>
            <div className='rounded-md border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]'>
                <div className='px-6 py-5 flex justify-between items-center'>
                    <h2 className='text-xl font-semibold text-gray-800 dark:text-white/90'>
                        Task Status
                    </h2>
                    <Button
                        onClick={handleOpenModal}
                        variant='primary'
                        size='sm'
                    >
                        <PlusIcon />
                        Add Task Status
                    </Button>
                </div>
                <div className='border-t border-gray-100 p-4 dark:border-gray-800 sm:p-6'>
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
                onClose={() => setToggle(false)}
                className='max-w-[700px] m-4'
                isFullscreen={false}
            >
                <TaskStatusModal setToggle={setToggle} />
            </Modal>
        </div>
    );
};

export default TaskStatus;
