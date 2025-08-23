import { Calendar, Info } from "lucide-react";
import type {
    FieldErrors,
    SubmitHandler,
    UseFormHandleSubmit,
} from "react-hook-form";
import type { ICustomerResponse, IRoomTypeResponse } from "@/types/hotel.type";

import Badge from "@/components/ui/Badge";
import BookingInformation from "./BookingInformation";
import Button from "@/components/ui/button/Button";
import ButtonGroup2 from "@/components/molecules/ButtonGroup2";
import { C } from "node_modules/@fullcalendar/core/internal-common";
import DatePicker from "@/components/ui/DatePicker";
import { Modal } from "@/components/common/Modal";
import RoomTypeInfo from "./RoomTypeInfo";
import Spinner from "@/components/atoms/Spinner2";
import { format } from "date-fns";
import { useGetRoomTypesQuery } from "@api/hooks/hotel/useRoomType";
import { useLazyGetRoomTypeAvailabilityRoomByIdQuery } from "@api/hooks/hotel/useRoomAvailability";
import { useState } from "react";

interface IRoomTypeWithAv extends IRoomTypeResponse {
    notAvailableRooms: number[];
    selectedRoomNumberId: string[];
}

interface IFormInput {
    name: string;
    email: string;
    mobileNumber: string;
}

interface IBookingInformation extends IRoomTypeResponse {
    roomNumberId: string;
    roomNumber: string;
}

interface IProps {
    selectedCustomer: ICustomerResponse | undefined;
    newCustomerName: string;
    newCustomerMobileNumber: string;
    handleSubmitCustomerForm: UseFormHandleSubmit<IFormInput, IFormInput>;
    customerError: FieldErrors<IFormInput>;
}

const RoomInformation = ({
    handleSubmitCustomerForm,
    customerError,

    selectedCustomer,
    newCustomerMobileNumber,
    newCustomerName,
}: IProps) => {
    const [fetchRoomTypeAvailabilityRoomById] =
        useLazyGetRoomTypeAvailabilityRoomByIdQuery();

    const [isCheckingAv, setIsCheckingAv] = useState(false);

    const [bookingInformationState, setBookingInformationState] = useState<
        IBookingInformation[] | []
    >([]);
    const [openRoomTypeInfoModal, setOpenRoomTypeInfoModal] = useState(false);
    const [selectedRoomTypeInfo, setSelectedRoomTypeInfo] = useState<
        IRoomTypeResponse | undefined
    >();

    const [selectedRoomTypeListState, setSelectedRoomTypeListState] = useState<
        IRoomTypeWithAv[] | undefined
    >([]);

    const [checkInDateState, setCheckInDateState] = useState<
        Date[] | undefined
    >([new Date()]);
    const [checkOutDateState, setCheckOutDateState] = useState<
        Date[] | undefined
    >(undefined);

    const { data: roomList } = useGetRoomTypesQuery({
        isPaginationEnabled: false,
        page: 1,
        pageSize: 10,
        isActive: true,
    });

    const handleCloseRoomInfoModal = () => {
        setOpenRoomTypeInfoModal(false);
    };

    const handleOpenRoomInfoModal = (roomTypeInfo: IRoomTypeResponse) => {
        setSelectedRoomTypeInfo(roomTypeInfo);
        setOpenRoomTypeInfoModal(true);
    };

    const handleCheckAvailability = async () => {
        setIsCheckingAv(true);
        const roomIds = roomList?.data?.result?.map((items) =>
            Number(items.id)
        );

        if (checkInDateState === undefined || checkOutDateState === undefined) {
            return;
        }

        if (!roomIds?.length) {
            return;
        }
        const notAvailableRoomsResponse =
            await fetchRoomTypeAvailabilityRoomById({
                roomTypeId: roomIds,
                checkInDate: format(checkInDateState[0], "yyyy-MM-dd"),
                checkOutDate: format(checkOutDateState[0], "yyyy-MM-dd"),
            }).unwrap();

        //

        const roomTypeIds = roomList?.data?.result?.map((items) => {
            let notAvailableRoomIds: number[] = [];

            const notAvailable = notAvailableRoomsResponse?.data.find(
                (item) => item.roomTypeId === items.id
            );

            if (notAvailable?.roomIdList?.length) {
                notAvailableRoomIds = notAvailable?.roomIdList;
            }
            return {
                ...items,
                notAvailableRooms: notAvailableRoomIds,
                selectedRoomNumberId: [],
            };
        });

        setSelectedRoomTypeListState(roomTypeIds);
        setIsCheckingAv(false);
    };

    const handleSelectRoomNumber = (
        roomTypeId: string,
        roomNumberId: string,
        roomNumber: string
    ) => {
        if (!selectedRoomTypeListState) {
            return;
        }

        const temp = selectedRoomTypeListState.map((item) => {
            if (String(item.id) === roomTypeId) {
                const ifRoomNumberAlreadyPresent =
                    item.selectedRoomNumberId.find(
                        (item2) => item2 === roomNumberId
                    );

                if (ifRoomNumberAlreadyPresent) {
                    const tempBookingInfo = bookingInformationState.filter(
                        (item2) => item2.roomNumberId !== roomNumberId
                    );

                    setBookingInformationState(tempBookingInfo);

                    return {
                        ...item,
                        selectedRoomNumberId: item.selectedRoomNumberId.filter(
                            (item2) => item2 !== roomNumberId
                        ),
                    };
                } else {
                    const tempBookingInfo = [
                        ...bookingInformationState,
                        {
                            ...item,
                            roomNumberId,
                            roomNumber,
                        },
                    ];

                    setBookingInformationState(tempBookingInfo);

                    return {
                        ...item,
                        selectedRoomNumberId: [
                            ...item.selectedRoomNumberId,
                            roomNumberId,
                        ],
                    };
                }
            }
            return item;
        });

        setSelectedRoomTypeListState(temp);
    };

    return (
        <div>
            <div className='rounded-lg border border-gray-200 p-5 lg:p-6 dark:border-gray-800'>
                <div className=' flex items-center justify-between mb-6'>
                    <div className='lg:mb-4'>
                        <h4 className='text-lg font-semibold text-gray-800  dark:text-white/90'>
                            Room Information{" "}
                            {isCheckingAv && (
                                <span className='ml-2'>
                                    <Spinner />
                                </span>
                            )}
                        </h4>
                        {!checkOutDateState?.length && (
                            <p className='text-sm text-red-300'>
                                Select Check-in and Check-out date to see
                                available rooms
                            </p>
                        )}
                    </div>
                    <div className='flex gap-8  justify-end items-center '>
                        <div>
                            <DatePicker
                                label='Check-in Date'
                                id='date-picker-Check-in-date'
                                mode='single'
                                placeholder='Select check-in date'
                                onChange={(date) => {
                                    setCheckInDateState(date);
                                }}
                                minDate={"today"}
                                defaultDate={
                                    checkInDateState &&
                                    checkInDateState?.length > 0 &&
                                    checkInDateState[0] !== undefined
                                        ? checkInDateState[0]
                                        : undefined
                                }
                            />
                        </div>
                        <div>
                            <DatePicker
                                label='Check-out Date'
                                id='date-picker-Check-out-date'
                                mode='single'
                                placeholder='Select check-out date'
                                minDate={"today"}
                                onChange={(date) => {
                                    setCheckOutDateState(date);
                                }}
                                // defaultDate={new Date()}
                            />
                        </div>

                        <Button
                            disabled={!checkInDateState || !checkOutDateState}
                            onClick={handleCheckAvailability}
                            size='xs'
                            variant='primary'
                        >
                            <Calendar className='h-4 w-4 text-white' />
                            <span>Check Availability</span>
                        </Button>
                    </div>
                </div>

                <div className='grid grid-cols-2   gap-8'>
                    <div className='col-span-1'>
                        {selectedRoomTypeListState?.map((item, index) => (
                            <div
                                key={item.id}
                                className='flex gap-6 w-full mb-4'
                            >
                                <div>
                                    <Badge
                                        badgeType='primary'
                                        title={String(index + 1)}
                                    />
                                </div>

                                <div className='rounded-lg border border-gray-200 p-4 lg:p-4 dark:border-gray-800 w-full'>
                                    <div className='flex gap-2 items-center mb-2'>
                                        <h4 className='text-lg font-semibold text-gray-800 lg:mb-2 dark:text-white/90'>
                                            Room Type : {item.name}
                                        </h4>
                                        <button
                                            className='mb-4'
                                            onClick={() => {
                                                if (item?.id) {
                                                    handleOpenRoomInfoModal(
                                                        item
                                                    );
                                                }
                                            }}
                                            title='Room Info'
                                        >
                                            <Info className='h-4 w-4 text-brand-500' />
                                        </button>
                                    </div>
                                    <div>
                                        <h3 className='mb-2'>
                                            Available Rooms
                                        </h3>
                                        <ButtonGroup2
                                            selectedRoomNumberList={
                                                item.selectedRoomNumberId
                                            }
                                            isBtnPresent={
                                                item?.rooms?.length > 0
                                            }
                                            btnList={item?.rooms?.map(
                                                (item2) => {
                                                    return {
                                                        btnText:
                                                            item2.roomNumber,
                                                        id: String(item2.id),
                                                        roomNumber:
                                                            item2.roomNumber,
                                                        key: String(item.id),
                                                        handleClick(
                                                            roomTypeId,
                                                            key,
                                                            roomNumber
                                                        ) {
                                                            handleSelectRoomNumber(
                                                                roomTypeId,
                                                                key,
                                                                roomNumber
                                                            );
                                                        },
                                                        disabled:
                                                            item?.notAvailableRooms?.includes(
                                                                item2.id
                                                            ),
                                                    };
                                                }
                                            )}
                                        >
                                            <p className='text-indigo-600 py-1 px-4'>
                                                Select Room type to see room
                                                list.
                                            </p>
                                        </ButtonGroup2>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {selectedRoomTypeListState?.length === 0 &&
                            roomList?.data?.result?.map((item, index) => (
                                <div
                                    key={item.id}
                                    className='flex gap-6 w-full mb-4'
                                >
                                    <div>
                                        <Badge
                                            badgeType='primary'
                                            title={String(index + 1)}
                                        />
                                    </div>

                                    <div className='rounded-lg border border-gray-200 p-4 lg:p-4 dark:border-gray-800 w-full'>
                                        <div className='flex gap-2 items-center mb-2'>
                                            <h4 className='text-lg font-semibold text-gray-800 lg:mb-2 dark:text-white/90'>
                                                Room Type : {item.name}
                                            </h4>
                                            <button
                                                className='mb-4'
                                                onClick={() => {
                                                    if (item?.id) {
                                                        handleOpenRoomInfoModal(
                                                            item
                                                        );
                                                    }
                                                }}
                                                title='Room Info'
                                            >
                                                <Info className='h-4 w-4 text-brand-500' />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                    <div className='col-span-1 rounded-lg border border-gray-200 p-4 lg:p-4 dark:border-gray-800 w-full'>
                        <BookingInformation
                            selectedCustomer={selectedCustomer}
                            checkInDateState={checkInDateState}
                            checkOutDateState={checkOutDateState}
                            bookingInformation={bookingInformationState}
                            newCustomerName={newCustomerName}
                            newCustomerMobileNumber={newCustomerMobileNumber}
                            customerError={customerError}
                            handleSubmitCustomerForm={handleSubmitCustomerForm}
                        />
                    </div>
                </div>
            </div>
            <Modal
                onClose={handleCloseRoomInfoModal}
                isOpen={openRoomTypeInfoModal}
                key={"RoomType"}
                className='max-w-[600px] mb-4  '
                isFullscreen={false}
            >
                <RoomTypeInfo selectedRoomTypeInfo={selectedRoomTypeInfo} />
            </Modal>
        </div>
    );
};

export default RoomInformation;
