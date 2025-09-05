import Button from "@/components/ui/button/Button";
import type { ICustomerResponse } from "@/types/config.types";
import type { IRoomTypeResponse } from "@/types/hotel.type";
import ReactTable from "@/components/common/ReactTable";
import { createColumnHelper } from "@tanstack/react-table";
import { useMemo } from "react";

interface IBookingInformation extends IRoomTypeResponse {
    roomNumberId: string;
    roomNumber: string;
}

type IProps = {
    bookingInformation: IBookingInformation[];
    checkInDateState: Date[] | undefined;
    checkOutDateState: Date[] | undefined;
    selectedCustomer: ICustomerResponse | undefined;
    newCustomerName: string;
    newCustomerMobileNumber: string;
};

const BookingModal = (props: IProps) => {
    const {
        bookingInformation,
        checkInDateState,
        checkOutDateState,
        selectedCustomer,
        newCustomerMobileNumber,
        newCustomerName,
    } = props;

    const columnHelper = createColumnHelper<IBookingInformation>();

    const columns = [
        columnHelper.accessor((row) => row.id, {
            id: "id",
            cell: (info) => (
                <div className='font-semibold text-gray-700 dark:text-slate-100'>
                    {info.renderValue()}
                </div>
            ),
            header: () => <div>S.N</div>,
        }),
        columnHelper.accessor((row) => row.roomNumber, {
            id: "roomNumber",
            cell: (info) => (
                <div className='font-semibold text-gray-700 dark:text-slate-100'>
                    {info.renderValue()}
                </div>
            ),
            header: () => <div>Room Number</div>,
        }),

        columnHelper.accessor((row) => row.name, {
            id: "name",
            cell: (info) => (
                <div className='font-semibold text-gray-700 dark:text-slate-100'>
                    {info.renderValue()}
                </div>
            ),
            header: () => <div>Room Type</div>,
        }),
        columnHelper.accessor((row) => row.roomPrice, {
            id: "roomPrice",
            cell: (info) => (
                <div className='font-semibold text-gray-700 dark:text-slate-100'>
                    {info.renderValue()}
                </div>
            ),
            header: () => <div>Total</div>,
        }),
    ];

    const totalPrice = useMemo(() => {
        let price = 0;

        for (let i = 0; i < bookingInformation.length; i++) {
            price += Number(bookingInformation[i].roomPrice);
        }

        return price;
    }, [bookingInformation]);

    const [priceBeforeVat, vat] = useMemo(() => {
        const priceBeforeVat =
            Math.round((totalPrice / 1.1 + Number.EPSILON) * 100) / 100;

        const vat =
            Math.round((totalPrice - priceBeforeVat + Number.EPSILON) * 100) /
            100;
        return [priceBeforeVat, vat];
    }, [totalPrice]);

    return (
        <div className='relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-6'>
            <div className='flex flex-col justify-between h-full m-4'>
                <div className='mb-6'>
                    <div className='flex justify-between items-baseline w-full '>
                        <h2 className='mb-4 text-2xl font-bold text-gray-800 dark:text-white/90'>
                            Booking Information
                        </h2>
                    </div>
                    <div className='flex items-center justify-between gap-6 mb-4'>
                        <h3 className='text-md font-medium text-gray-600 dark:text-gray-400'>
                            Customer's Name:{" "}
                            <span className=' text-gray-700 dark:text-gray-400'>
                                {selectedCustomer?.name ?? ""}
                                {selectedCustomer === undefined &&
                                    newCustomerName !== "" &&
                                    newCustomerName}
                            </span>
                        </h3>
                        <li className='flex items-center justify-between'>
                            <h3 className='text-md ont-medium text-gray-600 dark:text-gray-400'>
                                Mobile Number:{" "}
                                <span className=' text-gray-700 dark:text-gray-400'>
                                    {selectedCustomer?.mobileNumber ?? ""}
                                    {selectedCustomer === undefined &&
                                        newCustomerMobileNumber !== "" &&
                                        newCustomerMobileNumber}
                                </span>
                            </h3>
                        </li>
                    </div>
                    <ReactTable
                        isFetching={false}
                        showPagination={false}
                        columns={columns ?? []}
                        handleNext={() => {}}
                        handlePrevious={() => {}}
                        data={bookingInformation ?? []}
                        pagination={{
                            currentPage: 1,
                            pageSize: 10,
                            totalCount: 10,
                            totalPages: 1,
                        }}
                    />
                </div>

                <div className=' w-full'>
                    <div className='flex justify-between items-center w-full mb-2'>
                        <p className='mb-2 text-left text-lg font-semibold text-gray-800 dark:text-white/90'>
                            Booking summary
                        </p>
                    </div>
                    <div className='flex w-full  justify-between items-center'>
                        <div>
                            <ul className='space-y-2'>
                                <li className='flex justify-between gap-5'>
                                    <span className='text-sm text-gray-500 dark:text-gray-400'>
                                        Check-in Date:
                                    </span>
                                    <span className='text-sm font-medium text-gray-700 dark:text-gray-400'>
                                        {checkInDateState &&
                                            checkInDateState?.length > 0 &&
                                            checkInDateState[0] !== undefined &&
                                            new Date(
                                                checkInDateState[0]
                                            ).toLocaleDateString()}
                                    </span>
                                </li>
                                <li className='flex items-center justify-between'>
                                    <span className='text-sm text-gray-500 dark:text-gray-400'>
                                        Check-out Date:
                                    </span>
                                    <span className='text-sm font-medium text-gray-700 dark:text-gray-400'>
                                        {checkOutDateState &&
                                            checkOutDateState?.length > 0 &&
                                            checkOutDateState[0] !==
                                                undefined &&
                                            new Date(
                                                checkOutDateState[0]
                                            ).toLocaleDateString()}
                                    </span>
                                </li>
                                <li className='flex items-center justify-between'>
                                    <span className='font-medium text-gray-700 dark:text-gray-400'>
                                        Total Rooms:
                                    </span>
                                    <span className='text-lg font-semibold text-gray-800 dark:text-white/90'>
                                        {bookingInformation.length}
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <ul className='space-y-2'>
                                <li className='flex justify-between gap-5'>
                                    <span className='text-sm text-gray-500 dark:text-gray-400'>
                                        Sub Total
                                    </span>
                                    <span className='text-sm font-medium text-gray-700 dark:text-gray-400'>
                                        ${priceBeforeVat}
                                    </span>
                                </li>
                                <li className='flex items-center justify-between'>
                                    <span className='text-sm text-gray-500 dark:text-gray-400'>
                                        Vat (10%):
                                    </span>
                                    <span className='text-sm font-medium text-gray-700 dark:text-gray-400'>
                                        $0 {vat}
                                    </span>
                                </li>
                                <li className='flex items-center justify-between'>
                                    <span className='font-medium text-gray-700 dark:text-gray-400'>
                                        Total
                                    </span>
                                    <span className='text-lg font-semibold text-gray-800 dark:text-white/90'>
                                        ${totalPrice}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className='mt-6'>
                        <Button
                            variant='primary'
                            size='md'
                            className='bg-teal-500 hover:bg-teal-400!   w-full'
                        >
                            Submit
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
