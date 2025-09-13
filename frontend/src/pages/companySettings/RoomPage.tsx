import { Calendar, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/button/Button";
import type { IRoomResponse } from "@/types/hotel.type";
import { Modal } from "@/components/common/Modal";
import ReactTable from "@/components/common/ReactTable";
import RoomModal from "@/modal/RoomModal";
import SearchBar from "@/components/molecules/SearchBar";
import { SquarePen } from "lucide-react";
import Switch from "@/components/form/switch/Switch";
import { createColumnHelper } from "@tanstack/react-table";
import { useLazyGetRoomsQuery } from "@api/hooks/hotel/useRoom";

interface IProps {
    routedFrom: "COMPANY_SETTINGS" | undefined;
}

const RoomPage = ({ routedFrom }: IProps) => {
    const [selectedData, setSelectedData] = useState<
        undefined | IRoomResponse
    >();

    const [isActive, setIsActive] = useState<boolean>(true);
    const [keyword, setKeyword] = useState<string>("");
    const [toggle, setToggle] = useState(false);

    const [fetchAll, { isFetching, data: dataList }] = useLazyGetRoomsQuery();

    console.log({
        dataList,
    });

    useEffect(() => {
        fetchAll({
            isPaginationEnabled: true,
            page: 1,
            pageSize: 10,
            isActive: isActive,
            keyword: keyword,
        });
    }, [fetchAll, isActive]);

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

    const handleEdit = (data: IRoomResponse) => {
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

    const columnHelper = createColumnHelper<IRoomResponse>();

    const columns = [
        columnHelper.accessor((row) => row.roomNumber, {
            id: "name",
            cell: (info) => (
                <div className='font-semibold text-gray-700 dark:text-slate-100'>
                    {info.renderValue()}
                </div>
            ),
            header: () => <div>Room Name</div>,
        }),

        columnHelper.accessor((row) => row?.roomType?.name, {
            id: "room_type",
            cell: (info) => (
                <div className='font-semibold text-gray-700 dark:text-slate-100'>
                    {info.renderValue()}
                </div>
            ),
            header: () => <div>Room Type</div>,
        }),

        columnHelper.accessor((row) => row?.roomType?.roomPrice, {
            id: "roomPrice",
            cell: (info) => (
                <div className='font-semibold text-gray-700 dark:text-slate-100'>
                    {info.renderValue()}
                </div>
            ),
            header: () => <div>Room price</div>,
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

        columnHelper.accessor((row) => row.id, {
            id: "action",
            cell: (info) => (
                <div className='flex gap-4 '>
                    <Button
                        size='xs'
                        variant='primary'
                        onClick={() => handleEdit(info.row.original)}
                    >
                        <Calendar className='h-4 w-4 text-white' />
                        <span>Check Availability</span>
                    </Button>
                    {routedFrom && (
                        <Button
                            size='sm'
                            variant='outline'
                            onClick={() => handleEdit(info.row.original)}
                        >
                            <SquarePen className='h-5 w-5 text-blue-400' />
                            <span>Edit</span>
                        </Button>
                    )}
                </div>
            ),
            header: () => <span className='text-center'>Action</span>,
        }),
    ];

    return (
        <div>
            <div className='rounded-md border border-gray-200 bg-white dark:border-gray-800 dark:bg-slate-800'>
                <div className='flex flex-col justify-end md:justify-between gap-5 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center dark:border-gray-700'>
                    <div>
                        <h3 className='text-lg font-semibold text-gray-800 dark:text-white/90'>
                            Room
                        </h3>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                            {routedFrom
                                ? "Add/Edit room types."
                                : "Room details and availabilities"}
                        </p>
                    </div>

                    {routedFrom && (
                        <Button
                            onClick={handleOpenModal}
                            variant='primary'
                            size='sm'
                        >
                            <PlusIcon />
                            Add Room
                        </Button>
                    )}
                </div>

                <div className='border-b border-gray-200 px-5 py-4 dark:border-gray-800'>
                    <div className='flex items-center  justify-end  gap-2 md:gap-4 flex-wrap'>
                        {routedFrom && (
                            <Switch
                                onChange={() => {
                                    setIsActive(!isActive);
                                }}
                                label='Active'
                                defaultChecked={isActive}
                            />
                        )}

                        <SearchBar
                            setKeyword={setKeyword}
                            onChange={() => handleClearFilter()}
                            keyword={keyword}
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
                <RoomModal
                    setSelectedData={setSelectedData}
                    selectedData={selectedData}
                    handleCloseModal={handleCloseModal}
                />
            </Modal>
        </div>
    );
};

export default RoomPage;
