import type { FieldErrors, UseFormHandleSubmit } from "react-hook-form";
import type {
    IBookingPayload,
    ICustomerResponse,
    IRoomTypeResponse,
} from "@/types/hotel.type";
import { useEffect, useMemo, useState } from "react";

import BookingModal from "@/modal/BookingModal";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/common/Modal";
import ReactTable from "@/components/common/ReactTable";
import { createColumnHelper } from "@tanstack/react-table";
import { getCustomerError } from "@/utils/customError";
import { toast } from "react-toastify";
import { useCreateBookingMutation } from "@apiHooks/hotel/useBooking";

interface IBookingInformation extends IRoomTypeResponse {
    roomNumberId: string;
    roomNumber: string;
}

interface IFormInput {
    name: string;
    email: string;
    mobileNumber: string;
}
type IProps = {
    bookingInformation: IBookingInformation[];
    checkInDateState: Date[] | undefined;
    checkOutDateState: Date[] | undefined;
    selectedCustomer: ICustomerResponse | undefined;
    newCustomerName: string;
    newCustomerMobileNumber: string;
    handleSubmitCustomerForm: UseFormHandleSubmit<IFormInput, IFormInput>;
    customerError: FieldErrors<IFormInput>;
};

const BookingInformation = (props: IProps) => {
    const {
        bookingInformation,
        checkInDateState,
        checkOutDateState,
        selectedCustomer,
        newCustomerMobileNumber,
        newCustomerName,
        handleSubmitCustomerForm,
    } = props;
    const [allowBookingBtn, setAllowBookingBtn] = useState<boolean>(false);
    const [createBooking] = useCreateBookingMutation();
    const [toggle, setToggle] = useState(false);
    console.log({
        checkInDateState,
        checkOutDateState,
    });

    useEffect(() => {
        if (
            checkInDateState &&
            checkInDateState?.length > 0 &&
            checkInDateState[0] !== undefined &&
            checkOutDateState &&
            checkOutDateState?.length > 0 &&
            checkOutDateState[0] !== undefined
        ) {
            setAllowBookingBtn(true);
        }
    }, [checkInDateState, checkOutDateState]);

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

    const handleGetCustomerPayload = () => {
        return new Promise<IFormInput>((resolve, reject) => {
            const customerFormHandler = handleSubmitCustomerForm(
                (data) => {
                    resolve(data as IFormInput);
                },
                () => {
                    reject(new Error("Invalid Form."));
                }
            );

            customerFormHandler(); // run it
        });
    };

    const handleSubmitToBackend = async () => {
        try {
            const roomNumberIds = bookingInformation.map((room) =>
                Number(room.roomNumberId)
            );

            if (roomNumberIds?.length === 0) {
                toast.error("Please select at least one room.");
                return;
            }
            let payload: IBookingPayload;
            if (selectedCustomer) {
                payload = {
                    checkInDate: checkInDateState?.[0] ?? new Date(),
                    checkOutDate: checkOutDateState?.[0] ?? new Date(),
                    bookingDate: new Date(),
                    associated_internal_company_id: 4,
                    roomNumberIds: roomNumberIds,
                    isNewCustomer: false,
                    customerId: selectedCustomer.id,
                    bookingIdemKey: crypto.randomUUID(),
                };
            } else {
                const customerPayload = await handleGetCustomerPayload();

                payload = {
                    isNewCustomer: true,
                    checkInDate: checkInDateState?.[0] ?? new Date(),
                    checkOutDate: checkOutDateState?.[0] ?? new Date(),
                    bookingDate: new Date(),
                    name: customerPayload.name,
                    email: customerPayload.email,
                    mobileNumber: customerPayload.mobileNumber,
                    associated_internal_company_id: 4,
                    roomNumberIds: roomNumberIds,
                    bookingIdemKey: crypto.randomUUID(),
                };
            }

            const response = await createBooking(payload).unwrap();
            console.log("response", response);
        } catch (error) {
            console.log(error);
            if (error instanceof Error && error.message === "Invalid Form.") {
                toast.error(error.message);
            } else {
                const err = getCustomerError(error);
                toast.error(err?.message ?? "Something went wrong.");
            }
        }
    };

    const handleOpenToggle = () => {
        setToggle(true);
    };

    return (
        <div className='flex flex-col justify-between h-full'>
            <div className='mb-6'>
                <div className='flex justify-between items-baseline w-full mb-4'>
                    <h2 className='mb-2 text-lg font-semibold text-gray-800 dark:text-white/90'>
                        Booking Information
                    </h2>
                    <div>
                        <ul className='space-y-2'>
                            <li className='flex justify-between gap-5'>
                                <span className='text-sm text-gray-500 dark:text-gray-400'>
                                    Customer's Name:
                                </span>
                                <span className='text-sm font-medium text-gray-700 dark:text-gray-400'>
                                    {selectedCustomer?.name ?? ""}
                                    {selectedCustomer === undefined &&
                                        newCustomerName !== "" &&
                                        newCustomerName}
                                </span>
                            </li>
                            <li className='flex items-center justify-between'>
                                <span className='text-sm text-gray-500 dark:text-gray-400'>
                                    Mobile Number:
                                </span>
                                <span className='text-sm font-medium text-gray-700 dark:text-gray-400'>
                                    {selectedCustomer?.mobileNumber ?? ""}
                                    {selectedCustomer === undefined &&
                                        newCustomerMobileNumber !== "" &&
                                        newCustomerMobileNumber}
                                </span>
                            </li>
                        </ul>
                    </div>
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
                                        checkOutDateState[0] !== undefined &&
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
                <div className='mt-6 flex w-full justify-end'>
                    <Button
                        variant='primary'
                        size='md'
                        title={!allowBookingBtn ? "Select Dates" : ""}
                        disabled={!allowBookingBtn}
                        onClick={() => {
                            handleOpenToggle();
                        }}
                    >
                        Confirm Booking
                    </Button>
                </div>
            </div>
            <Modal
                isOpen={toggle}
                onClose={() => setToggle(false)}
                blurEffect='32px'
                className='max-w-7xl mb-4  '
                isFullscreen={false}
            >
                <BookingModal
                    bookingInformation={bookingInformation}
                    checkInDateState={checkInDateState}
                    checkOutDateState={checkOutDateState}
                    selectedCustomer={selectedCustomer}
                    newCustomerMobileNumber={newCustomerMobileNumber}
                    newCustomerName={newCustomerName}
                    // handleSubmitToBackend={handleSubmitToBackend}
                    // handleCloseModal={() => setToggle(false)}
                />
            </Modal>
        </div>
    );
};

export default BookingInformation;
