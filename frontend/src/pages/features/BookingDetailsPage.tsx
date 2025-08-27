import type { IBookingRoomResponse } from "@/types/hotel.type";
import ReactTable from "@/components/common/ReactTable";
import { createColumnHelper } from "@tanstack/react-table";
import { current } from "@reduxjs/toolkit";
import { format } from "date-fns";
import { useEffect } from "react";
import { useLazyGetBookingByIdQuery } from "@apiHooks/hotel/useBooking";
import { useParams } from "react-router-dom";

const BookingDetailsPage = () => {
    const { bookingId } = useParams();

    const [fetchById, { data, isFetching }] = useLazyGetBookingByIdQuery();

    console.log({
        bookingId,
    });

    useEffect(() => {
        fetchById({
            payloadId: Number(bookingId),
        });
    }, [bookingId]);

    const columnHelper = createColumnHelper<IBookingRoomResponse>();

    const columns = [
        columnHelper.accessor((row) => row.userBookingRoomId, {
            id: "userBookingRoomId",
            cell: (info) => (
                <div className='font-semibold text-gray-700 dark:text-slate-100'>
                    {info.renderValue()}
                </div>
            ),
            header: () => <div>Room Booking ID</div>,
        }),
        columnHelper.accessor((row) => row.room.roomNumber, {
            id: "roomNumber",
            cell: (info) => (
                <div className='font-semibold text-gray-700 dark:text-slate-100'>
                    {info.renderValue()}
                </div>
            ),
            header: () => <div>Room Number</div>,
        }),

        columnHelper.accessor((row) => row.room.roomType.name, {
            id: "name",
            cell: (info) => (
                <div className='font-semibold text-gray-700 dark:text-slate-100'>
                    {info.renderValue()}
                </div>
            ),
            header: () => <div>Room Type</div>,
        }),
        columnHelper.accessor((row) => row.room.roomType.roomPrice, {
            id: "roomPrice",
            cell: (info) => (
                <div className='font-semibold text-gray-700 dark:text-slate-100'>
                    {info.renderValue()}
                </div>
            ),
            header: () => <div>Room Price</div>,
        }),
    ];

    return (
        <div>
            <div className='flex flex-col justify-between gap-6 rounded-2xl border border-gray-200 bg-white px-6 py-5 sm:flex-row sm:items-center dark:border-gray-800 dark:bg-white/3 mb-6'>
                <div className='flex flex-col gap-2.5 divide-gray-300 sm:flex-row sm:divide-x dark:divide-gray-700'>
                    <div className='flex items-center gap-2 sm:pr-3'>
                        <span className='text-base font-medium text-gray-700 dark:text-gray-400'>
                            Booking ID : #34834
                        </span>
                    </div>
                    <p className='text-sm text-gray-500 sm:pl-3 dark:text-gray-400'>
                        Booking date:&nbsp;{" "}
                        {format(
                            data?.data?.bookingDate ?? new Date(),
                            "dd-MM-yyyy hh:mm a"
                        )}
                    </p>
                </div>
                <div className='flex gap-3'>
                    <span className='bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500 inline-flex items-center justify-center gap-1 rounded-full px-2.5 py-1 text-sm font-medium'>
                        Completed
                    </span>
                </div>
            </div>
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-12'>
                <div className='lg:col-span-8 2xl:col-span-9'>
                    <div className='rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3'>
                        <h2 className='mb-5 text-lg font-semibold text-gray-800 dark:text-white/90'>
                            Booking Details
                        </h2>
                        <div className=' rounded-md border border-gray-100 dark:border-gray-800'>
                            <div className=' overflow-x-auto'>
                                {/* Table  */}
                                <ReactTable
                                    columns={columns}
                                    data={data?.data?.bookingRooms ?? []}
                                    isFetching={isFetching}
                                    showPagination={false}
                                    pagination={{
                                        currentPage: 1,
                                        pageSize: 10,
                                        totalCount: 10,
                                        totalPages: 1,
                                    }}
                                    handleNext={() => {}}
                                    handlePrevious={() => {}}
                                />
                            </div>
                        </div>
                        <div className='flex flex-wrap justify-between sm:justify-end'>
                            <div className='mt-6 w-full space-y-1 text-right sm:w-[220px]'>
                                <p className='mb-4 text-left text-sm font-medium text-gray-800 dark:text-white/90'>
                                    Booking summary
                                </p>
                                <ul className='space-y-2'>
                                    <li className='flex justify-between gap-5'>
                                        <span className='text-sm text-gray-500 dark:text-gray-400'>
                                            Sub Total
                                        </span>
                                        <span className='text-sm font-medium text-gray-700 dark:text-gray-400'>
                                            $3,850
                                        </span>
                                    </li>
                                    <li className='flex items-center justify-between'>
                                        <span className='text-sm text-gray-500 dark:text-gray-400'>
                                            Vat (10%):
                                        </span>
                                        <span className='text-sm font-medium text-gray-700 dark:text-gray-400'>
                                            $385
                                        </span>
                                    </li>
                                    <li className='flex items-center justify-between'>
                                        <span className='font-medium text-gray-700 dark:text-gray-400'>
                                            Total
                                        </span>
                                        <span className='text-lg font-semibold text-gray-800 dark:text-white/90'>
                                            {data?.data?.totalPrice}
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='space-y-6 lg:col-span-4 2xl:col-span-3'>
                    <div className='rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3'>
                        <h2 className='mb-5 text-lg font-semibold text-gray-800 dark:text-white/90'>
                            Customer Details
                        </h2>
                        <ul className='divide-y divide-gray-100 dark:divide-gray-800'>
                            <li className='flex items-start gap-5 py-2.5'>
                                <span className='w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400'>
                                    Name
                                </span>
                                <span className='w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400'>
                                    {data?.data?.customer?.name}
                                </span>
                            </li>
                            <li className='flex items-start gap-5 py-2.5'>
                                <span className='w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400'>
                                    Email
                                </span>
                                <span className='w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400'>
                                    {data?.data?.customer?.email}
                                </span>
                            </li>
                            <li className='flex items-start gap-5 py-2.5'>
                                <span className='w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400'>
                                    Phone
                                </span>
                                <span className='w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400'>
                                    {data?.data?.customer?.mobileNumber}
                                </span>
                            </li>
                            {/* <li className='flex items-start gap-5 py-2.5'>
                                <span className='w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400'>
                                    Added By:
                                </span>
                                <span className='w-1/2 text-sm text-gray-700 sm:w-2/3 dark:text-gray-400'>
                                    {data?.data?.customer?.CredentialType}
                                </span>
                            </li> */}
                        </ul>
                    </div>
                    <div className='rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3'>
                        <h2 className='mb-5 text-lg font-semibold text-gray-800 dark:text-white/90'>
                            Booking History
                        </h2>
                        {/* Timeline item */}
                        <div className='relative pb-7 pl-11'>
                            {/* Icon */}
                            <div className='absolute top-0 left-0 z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-50 bg-white text-gray-700 ring ring-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:ring-gray-800'>
                                {/* Shopping cart icon */}
                                <svg
                                    className='size-5'
                                    width={18}
                                    height={18}
                                    viewBox='0 0 18 18'
                                    fill='none'
                                    xmlns='http://www.w3.org/2000/svg'
                                >
                                    <path
                                        d='M1.73828 3H2.6237C3.18449 3 3.65964 3.41301 3.73774 3.96834L3.85169 4.77871M3.85169 4.77871L4.67828 10.6567C4.75637 11.212 5.23153 11.625 5.79232 11.625L12.8135 11.625C13.2612 11.625 13.6663 11.3595 13.845 10.949L15.8455 6.35267C16.1689 5.60962 15.6243 4.77871 14.814 4.77871H3.85169Z'
                                        stroke='currentColor'
                                        strokeWidth='1.2'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                    />
                                    <path
                                        d='M5.83789 14.625H5.84539M12.2407 14.625H12.2482'
                                        stroke='currentColor'
                                        strokeWidth='2.7'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                    />
                                </svg>
                            </div>
                            <div className='ml-6 flex justify-between'>
                                <div>
                                    <h4 className='font-medium text-gray-800 dark:text-white/90'>
                                        Check-in | check-out
                                    </h4>
                                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                                        {format(
                                            data?.data?.checkInDate ??
                                                new Date(),
                                            "dd-MM-yyyy"
                                        )}{" "}
                                        |{" "}
                                        {format(
                                            data?.data?.checkOutDate ??
                                                new Date(),
                                            "dd-MM-yyyy"
                                        )}
                                    </p>
                                </div>
                            </div>
                            {/* Vertical line */}
                            <div className='absolute top-8 left-6 h-full w-px border border-dashed border-gray-300 dark:border-gray-700' />
                        </div>
                        {/* Timeline item */}
                        <div className='relative pb-7 pl-11'>
                            {/* Icon */}
                            <div className='absolute top-0 left-0 z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-50 bg-white text-gray-700 ring ring-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:ring-gray-800'>
                                {/*Card icon */}
                                <svg
                                    className='size-5'
                                    xmlns='http://www.w3.org/2000/svg'
                                    width={18}
                                    height={18}
                                    viewBox='0 0 18 18'
                                    fill='none'
                                >
                                    <path
                                        d='M2.0625 7.875V12.9375C2.0625 13.5588 2.56618 14.0625 3.1875 14.0625H6.97559M2.0625 7.875V6.75M2.0625 7.875H9.06152C9.06152 7.875 10.3431 6.7552 12.4698 6.75M2.0625 6.75V5.0625C2.0625 4.44118 2.56618 3.9375 3.1875 3.9375H14.8125C15.4338 3.9375 15.9375 4.44118 15.9375 5.0625V6.75M2.0625 6.75H12.4698M15.9375 6.75V7.92188C15.9375 7.92188 14.649 6.75526 12.4995 6.75M15.9375 6.75H12.4995M12.4698 6.75C12.4797 6.74998 12.4896 6.74998 12.4995 6.75M12.4698 6.75H12.4995M13.7812 10.8576C13.7812 10.3139 13.3405 9.87318 12.7968 9.87318H12.2812C11.6599 9.87318 11.1562 10.3769 11.1562 10.9982V11.197C11.1562 11.6659 11.4471 12.0857 11.8862 12.2503L13.0513 12.6873C13.4904 12.852 13.7812 13.2717 13.7812 13.7406V13.9395C13.7812 14.5608 13.2776 15.0645 12.6562 15.0645H12.1407C11.597 15.0645 11.1562 14.6237 11.1562 14.08M12.4688 15.0645V15.9375M12.4688 9V9.87318'
                                        stroke='currentColor'
                                        strokeWidth='1.2'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                    />
                                </svg>
                            </div>
                            <div className='ml-6 flex justify-between'>
                                <div>
                                    <h4 className='font-medium text-gray-800 dark:text-white/90'>
                                        Payment Status
                                    </h4>
                                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                                        {data?.data?.payment_status}
                                    </p>
                                </div>
                            </div>
                            {/* Vertical line */}
                            <div className='absolute top-8 left-6 h-full w-px border border-dashed border-gray-300 dark:border-gray-700' />
                        </div>
                        {/* Timeline item */}
                        <div className='relative pl-11'>
                            {/* Icon */}
                            <div className='absolute top-0 left-0 z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-50 bg-white text-gray-700 ring ring-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:ring-gray-800'>
                                {/*Card icon */}
                                <svg
                                    className='size-5'
                                    xmlns='http://www.w3.org/2000/svg'
                                    width={18}
                                    height={18}
                                    viewBox='0 0 18 18'
                                    fill='none'
                                >
                                    <path
                                        d='M15.9375 4.67548V12.9375C15.9375 13.5588 15.4338 14.0625 14.8125 14.0625H3.1875C2.56618 14.0625 2.0625 13.5588 2.0625 12.9375V4.67548M2.80194 3.9375H15.1983C15.6066 3.9375 15.9375 4.26843 15.9376 4.67669C15.9376 4.91843 15.8195 5.14491 15.6212 5.28318L9.64374 9.45142C9.25711 9.72103 8.7434 9.72103 8.35676 9.45142L2.37912 5.28304C2.18095 5.14485 2.06282 4.91854 2.06274 4.67694C2.06261 4.2686 2.3936 3.9375 2.80194 3.9375Z'
                                        stroke='currentColor'
                                        strokeWidth='1.3'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                    />
                                </svg>
                            </div>
                            <div className='ml-6 flex justify-between'>
                                <div>
                                    <h4 className='font-medium text-gray-800 dark:text-white/90'>
                                        Email Sent To Customer
                                    </h4>
                                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                                        {format(
                                            data?.data?.bookingDate ??
                                                new Date(),
                                            "dd-MM-yyyy"
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Action buttons */}
                        {/* <div className='mt-5 flex items-center justify-center gap-2'>
                            <button className='shadow-theme-xs rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'>
                                Resend
                            </button>
                            <button className='shadow-theme-xs rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'>
                                Forward
                            </button>
                            <button className='shadow-theme-xs rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'>
                                Preview
                            </button>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingDetailsPage;
