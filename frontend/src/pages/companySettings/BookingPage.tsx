import type { IBookingResponse, ICustomerResponse } from "@/types/hotel.type";
import { useEffect, useState } from "react";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/button/Button";
import DatePicker from "@/components/ui/DatePicker";
import InfiniteScrollSelect from "@/components/common/InfiniteLoading";
import Label from "@/components/form/Label";
import { PlusIcon } from "lucide-react";
import ReactTable from "@/components/common/ReactTable";
import { SquarePen } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";
import { useLazyGetAllCustomerQuery } from "@apiHooks/useCustomer";
import { useLazyGetBookingQuery } from "@api/hooks/hotel/useBooking";
import { useNavigate } from "react-router-dom";

const BookingPage = () => {
    const navigate = useNavigate();
    const [selectedData, setSelectedData] = useState<
        undefined | IBookingResponse
    >();
    const [selectedCustomer, setSelectedCustomer] = useState<
        ICustomerResponse | undefined
    >();

    const [checkInDateState, setCheckInDateState] = useState<
        Date[] | undefined
    >(undefined);
    const [checkOutDateState, setCheckOutDateState] = useState<
        Date[] | undefined
    >(undefined);
    const [fetchCustomerAll] = useLazyGetAllCustomerQuery();
    const [fetchAll, { isFetching, data: dataList }] = useLazyGetBookingQuery();

    console.log({
        dataList,
    });

    useEffect(() => {
        fetchAll({
            isPaginationEnabled: true,
            page: 1,
            pageSize: 10,
            customerId: undefined,
        });
    }, []);

    const handleSearch = () => {
        fetchAll({
            isPaginationEnabled: true,
            page: 1,
            pageSize: 10,
            dateStart: checkInDateState?.[0],
            dateEnd: checkOutDateState?.[0],
            customerId: selectedCustomer?.id,
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
        });
    };

    const handleNext = () => {
        if (!dataList?.data?.pagination?.currentPage) return;

        fetchAll(
            {
                isPaginationEnabled: true,
                page: dataList?.data?.pagination?.currentPage + 1,
                pageSize: dataList?.data?.pagination?.pageSize,
            },
            true
        );
    };

    const handleEdit = (data: IBookingResponse) => {
        setSelectedData(data);
    };

    const handleNavigate = (data: IBookingResponse) => {
        console.log("LOG: ~ handleNavigate ~ data:", data);
        navigate(`/admin/features/booking/details/${data.id}`);
    };

    const columnHelper = createColumnHelper<IBookingResponse>();

    const columns = [
        columnHelper.accessor((row) => row.customer, {
            id: "name",
            cell: (info) => (
                <div className='font-semibold text-gray-700 dark:text-slate-100'>
                    {info.renderValue()?.name}
                </div>
            ),
            header: () => <div>Customer's Name</div>,
        }),
        columnHelper.accessor((row) => row.customer, {
            id: "mobileNumber",
            cell: (info) => (
                <div className='font-semibold text-gray-700 dark:text-slate-100'>
                    {info.renderValue()?.mobileNumber}
                </div>
            ),
            header: () => <div>Mobile Number</div>,
        }),

        columnHelper.accessor((row) => row.checkInDate, {
            id: "checkInDate",
            cell: (info) => (
                <div className='font-semibold text-gray-700 dark:text-slate-100'>
                    {format(info.renderValue() ?? new Date(), "dd-MM-yyyy")}
                </div>
            ),
            header: () => <div>Check-in Date</div>,
        }),
        columnHelper.accessor((row) => row.checkOutDate, {
            id: "checkOutDate",
            cell: (info) => (
                <div className='font-semibold text-gray-700 dark:text-slate-100'>
                    {format(info.renderValue() ?? new Date(), "dd-MM-yyyy")}
                </div>
            ),
            header: () => <div>Check-out Date</div>,
        }),

        columnHelper.accessor((row) => row.status, {
            id: "status",
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

        columnHelper.accessor((row) => row.totalPrice, {
            id: "totalPrice",
            cell: (info) => (
                <div className='font-semibold text-gray-700 dark:text-slate-100'>
                    {info.renderValue()}
                </div>
            ),
            header: () => <div>Total Price</div>,
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
                    <Button
                        size='sm'
                        variant='primary'
                        onClick={() => handleNavigate(info.row.original)}
                    >
                        <SquarePen className='h-5 w-5 text-white dark:text-slate-700' />
                        <span className='text-white dark:text-slate-700'>
                            Invoice
                        </span>
                    </Button>
                </div>
            ),
            header: () => <span className='text-center'>Action</span>,
        }),
    ];

    return (
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
                        <DatePicker
                            label='Check-in Date'
                            id='date-picker-checking'
                            mode='single'
                            placeholder='Check-in Date'
                            onChange={(date) => {
                                setCheckInDateState(date);
                            }}
                            // defaultDate={new Date()}
                        />
                    </div>
                    <div>
                        <DatePicker
                            label='Checkout'
                            id='date-picker-checkout'
                            mode='single'
                            placeholder='Checkout'
                            onChange={(date) => {
                                setCheckOutDateState(date);
                            }}
                            // defaultDate={new Date()}
                        />
                    </div>

                    <div className='min-w-[300px] relative'>
                        <Label className='absolute top-[-10px] left-3 bg-white dark:bg-gray-800  z-10 px-1'>
                            Customer
                        </Label>
                        <InfiniteScrollSelect<ICustomerResponse>
                            fetchAll={fetchCustomerAll}
                            getOptionLabel={(item) => {
                                return `${item?.name} | ${item?.mobileNumber}`;
                            }}
                            getOptionValue={(item) => item?.id}
                            preselectedValue={undefined}
                            onSelect={(item) => setSelectedCustomer(item)}
                            placeholder={"Select customer"}
                        />
                    </div>

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
    );
};

export default BookingPage;
