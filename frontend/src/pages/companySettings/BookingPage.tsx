import { useEffect, useState } from "react";
import {
    useGetAllCustomerQuery,
    useLazyGetAllCustomerQuery,
} from "@apiHooks/useCustomer";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/button/Button";
import type { ICustomerResponse } from "@/types/hotel.type";
import type { IRoomTypeResponse } from "@/types/hotel.type";
import InfiniteScrollSelect from "@/components/common/InfiniteLoading";
import { Modal } from "@/components/common/Modal";
import { PlusIcon } from "lucide-react";
import ReactTable from "@/components/common/ReactTable";
import RoomTypeModal from "@/modal/RoomTypeModal";
import SearchBar from "@/components/molecules/SearchBar";
import { SquarePen } from "lucide-react";
import Switch from "@/components/form/switch/Switch";
import { createColumnHelper } from "@tanstack/react-table";
import { useLazyGetRoomTypesQuery } from "@api/hooks/hotel/useRoomType";

const BookingPage = () => {
    const [selectedData, setSelectedData] = useState<
        undefined | IRoomTypeResponse
    >();

    const { data: customerList } = useGetAllCustomerQuery({
        isPaginationEnabled: true,
        page: 1,
        pageSize: 10,
        keyword: "",
    });

    const [fetchCustomerAll, { data, isFetching: isCustomerLoading }] =
        useLazyGetAllCustomerQuery();

    const [isActive, setIsActive] = useState<boolean>(true);
    const [keyword, setKeyword] = useState<string>("");
    const [toggle, setToggle] = useState(false);

    const [fetchAll, { isFetching, data: dataList }] =
        useLazyGetRoomTypesQuery();

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

    const handleEdit = (data: IRoomTypeResponse) => {
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

    const columnHelper = createColumnHelper<IRoomTypeResponse>();

    const columns = [
        columnHelper.accessor((row) => row.name, {
            id: "name",
            cell: (info) => (
                <div className='font-semibold text-gray-700 dark:text-slate-100'>
                    {info.renderValue()}
                </div>
            ),
            header: () => <div>Name</div>,
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

        columnHelper.accessor((row) => row.roomPrice, {
            id: "roomPrice",
            cell: (info) => (
                <div className='font-semibold text-gray-700 dark:text-slate-100'>
                    {info.renderValue()}
                </div>
            ),
            header: () => <div>Room price</div>,
        }),
        columnHelper.accessor((row) => row.total_number_of_rooms, {
            id: "total_number_of_rooms",
            cell: (info) => (
                <div className='font-semibold text-gray-700 dark:text-slate-100'>
                    {info.renderValue()}
                </div>
            ),
            header: () => <div>Room price</div>,
        }),

        columnHelper.accessor((row) => row.id, {
            id: "action",
            cell: (info) => (
                <div className='flex  gap-4 '>
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
            header: () => <span className='text-center'>Action</span>,
        }),
    ];

    return (
        <div>
            <div className='rounded-md border border-gray-200 bg-white dark:border-gray-800 dark:bg-slate-800'>
                <div className='flex flex-col justify-end md:justify-between gap-5 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center dark:border-gray-700'>
                    <div>
                        <h3 className='text-lg font-semibold text-gray-800 dark:text-white/90'>
                            Booking List
                        </h3>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                            All booking list
                        </p>
                    </div>
                    <Button
                        onClick={handleOpenModal}
                        variant='primary'
                        size='sm'
                        className='bg-teal-500 hover:bg-teal-400!'
                    >
                        <PlusIcon />
                        Add New Booking
                    </Button>
                </div>

                <div className='border-b border-gray-200 px-5 py-4 dark:border-gray-800'>
                    <div className='flex items-center  justify-end  gap-4 md:gap-6 flex-wrap'>
                        <div>
                            <InfiniteScrollSelect<ICustomerResponse>
                                fetchAll={fetchCustomerAll}
                                getOptionLabel={(room) => room?.name}
                                getOptionValue={(room) => room?.id}
                                preselectedValue={undefined}
                                onSelect={(room) =>
                                    console.log("Selected:", room)
                                }
                            />
                        </div>
                        <div className='relative'>
                            <select
                                defaultValue={""}
                                className='block w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 pr-8 leading-tight text-gray-700 focus:border-blue-300 focus:bg-white focus:outline-none'
                            >
                                <option value='' disabled>
                                    Select customer
                                </option>
                                {customerList?.data?.result?.map((role) => (
                                    <option value={role.id} key={role.id}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <Switch
                            onChange={() => {
                                setIsActive(!isActive);
                            }}
                            label='TODAY'
                            defaultChecked={isActive}
                        />

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
                <RoomTypeModal
                    setSelectedData={setSelectedData}
                    selectedData={selectedData}
                    handleCloseModal={handleCloseModal}
                />
            </Modal>
        </div>
    );
};

export default BookingPage;
