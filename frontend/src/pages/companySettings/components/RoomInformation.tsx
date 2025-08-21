import { Calendar, Info, PlusCircleIcon, X } from "lucide-react";
import type { IRoomResponse, IRoomTypeResponse } from "@/types/hotel.type";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/button/Button";
import ButtonGroup2 from "@/components/molecules/ButtonGroup2";
import DatePicker from "@/components/ui/DatePicker";
import Label from "@/components/form/Label";
import { Modal } from "@/components/common/Modal";
import RoomTypeInfo from "./RoomTypeInfo";
import { format } from "date-fns";
import { useGetRoomTypesQuery } from "@api/hooks/hotel/useRoomType";
import { useLazyGetRoomTypeAvailabilityRoomByIdQuery } from "@api/hooks/hotel/useRoomAvailability";
import { useLazyGetRoomTypesByIdQuery } from "@api/hooks/hotel/useRoomType";
import { useState } from "react";

type TSelectRoom = {
    key: string;
    roomTypeId: string;
    RoomIndex: number;
    rooms: IRoomResponse[];
    roomTypeInfo: IRoomTypeResponse | null;
    selectedRoomNumber: string[];
    notAvailableRooms: number[];
};

const RoomInformation = () => {
    const [fetchRoomTypeInfoById] = useLazyGetRoomTypesByIdQuery();
    const [fetchRoomTypeAvailabilityRoomById] =
        useLazyGetRoomTypeAvailabilityRoomByIdQuery();

    const [openRoomTypeInfoModal, setOpenRoomTypeInfoModal] = useState(false);
    const [selectedRoomTypeInfo, setSelectedRoomTypeInfo] = useState<
        IRoomTypeResponse | undefined
    >();

    const [selectedRoomList, setSelectedRoomList] = useState<TSelectRoom[]>([]);

    const [checkInDateState, setCheckInDateState] = useState<
        Date[] | undefined
    >(undefined);
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

    const handleAddRoomType = () => {
        const temKey = (Math.random() * 10000).toFixed(0);
        const payload: TSelectRoom = {
            key: temKey,
            roomTypeId: "",
            RoomIndex: selectedRoomList.length + 1,
            rooms: [],
            roomTypeInfo: null,
            selectedRoomNumber: [],
            notAvailableRooms: [],
        };

        setSelectedRoomList([...selectedRoomList, payload]);
    };

    const handleSelectRoomType = async (
        roomTypeId: string,
        selectedKey: string
    ) => {
        const response = await fetchRoomTypeInfoById({
            roomTypesId: Number(roomTypeId),
        }).unwrap();

        console.log({
            checkInDateState,
            checkOutDateState,
        });

        if (checkInDateState === undefined || checkOutDateState === undefined) {
            return;
        }

        const notAvailableRoomsResponse =
            await fetchRoomTypeAvailabilityRoomById({
                payloadId: Number(roomTypeId),
                checkInDate: format(checkInDateState[0], "yyyy-MM-dd"),
                checkOutDate: format(checkOutDateState[0], "yyyy-MM-dd"),
            }).unwrap();

        console.log({
            response,
        });

        console.log({
            notAvailableRoomsResponse,
        });

        let updatedSelectedRooms = selectedRoomList;
        const ifRoomTypeIndexPresent = selectedRoomList.findIndex(
            (item) => item.key === selectedKey
        );

        const roomType = selectedRoomList.find(
            (item) => item.key === selectedKey
        );

        if (ifRoomTypeIndexPresent !== -1 && roomType) {
            const temp: TSelectRoom = {
                key: roomType.key,
                roomTypeId: String(response?.data?.id),
                rooms: response?.data?.rooms,
                roomTypeInfo: response?.data,
                RoomIndex: roomType.RoomIndex,
                selectedRoomNumber: [],
                notAvailableRooms: notAvailableRoomsResponse?.data?.roomIdList,
            };
            // replace the old with new
            updatedSelectedRooms = [
                ...selectedRoomList.slice(0, ifRoomTypeIndexPresent),
                temp,
                ...selectedRoomList.slice(ifRoomTypeIndexPresent + 1),
            ];
        }

        setSelectedRoomList([...updatedSelectedRooms]);
    };

    const handleSelectRoomNumber = async (
        roomId: string,
        selectedKey: string
    ) => {
        let updatedSelectedRooms = selectedRoomList;
        const ifRoomTypeIndexPresent = selectedRoomList.findIndex(
            (item) => item.key === selectedKey
        );

        const roomType = selectedRoomList.find(
            (item) => item.key === selectedKey
        );

        if (ifRoomTypeIndexPresent !== -1 && roomType) {
            const ifRoomTypePresent = roomType?.selectedRoomNumber.findIndex(
                (item) => item === roomId
            );

            const currentRoomNumber = roomType?.selectedRoomNumber;

            if (ifRoomTypePresent !== -1) {
                currentRoomNumber.splice(ifRoomTypePresent, 1);
            } else {
                currentRoomNumber.push(roomId);
            }

            const temp: TSelectRoom = {
                ...roomType,
                selectedRoomNumber: [...currentRoomNumber],
            };
            updatedSelectedRooms = [
                ...selectedRoomList.slice(0, ifRoomTypeIndexPresent),
                temp,
                ...selectedRoomList.slice(ifRoomTypeIndexPresent + 1),
            ];
        }

        setSelectedRoomList([...updatedSelectedRooms]);
    };

    return (
        <div>
            <div className='rounded-lg border border-gray-200 p-5 lg:p-6 dark:border-gray-800'>
                <div className='flex items-center justify-between mb-6'>
                    <div>
                        <h4 className='text-lg font-semibold text-gray-800 lg:mb-4 dark:text-white/90'>
                            Room Information
                        </h4>
                        <div className='flex gap-6 '>
                            <div>
                                <DatePicker
                                    label='Check-in Date'
                                    id='date-picker-Check-in-date'
                                    mode='single'
                                    placeholder='Select check-in date'
                                    onChange={(date) => {
                                        setCheckInDateState(date);
                                    }}
                                    // defaultDate={new Date()}
                                />
                            </div>
                            <div>
                                <DatePicker
                                    label='Check-out Date'
                                    id='date-picker-Check-out-date'
                                    mode='single'
                                    placeholder='Select check-out date'
                                    onChange={(date) => {
                                        setCheckOutDateState(date);
                                    }}
                                    // defaultDate={new Date()}
                                />
                            </div>
                            <Button
                                disabled={
                                    !checkInDateState || !checkOutDateState
                                }
                                onClick={handleAddRoomType}
                                variant='primary'
                                size='xs'
                            >
                                <PlusCircleIcon />
                                Add Room Types
                            </Button>
                        </div>
                    </div>
                    <div>
                        <p className='text-md font-semibold text-gray-800 lg:mb-2 dark:text-white/90'>
                            Total Room Selected: {selectedRoomList.length}
                        </p>
                        <h3 className='text-md font-semibold text-gray-800 lg:mb-2 dark:text-white/90'>
                            Total Price: {selectedRoomList.length}
                        </h3>
                    </div>
                </div>

                {selectedRoomList.map((item, index) => (
                    <div key={item.key} className='flex gap-6 w-full mb-4'>
                        <div>
                            <Badge
                                badgeType='primary'
                                title={String(index + 1)}
                            />
                        </div>

                        <div className='rounded-lg border border-gray-200 p-4 lg:p-4 dark:border-gray-800 w-full'>
                            <div className='grid grid-cols-8 gap-12 items-end'>
                                <div className='sm:col-span-2  lg:col-span-2'>
                                    <Label>
                                        Room Type
                                        <span className='text-error-500'>
                                            *
                                        </span>
                                    </Label>
                                    <select
                                        value={item.roomTypeId}
                                        onChange={(e) =>
                                            handleSelectRoomType(
                                                e.target.value,
                                                item.key
                                            )
                                        }
                                        className={`h-9 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-1.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800  `}
                                    >
                                        <option
                                            value=''
                                            disabled
                                            className='text-gray-700 dark:bg-gray-900 dark:text-gray-400'
                                        >
                                            select room type
                                        </option>
                                        {roomList?.data?.result?.map((item) => {
                                            return (
                                                <option
                                                    className='text-gray-700 dark:bg-gray-900 dark:text-gray-400'
                                                    key={item.id}
                                                    value={item.id}
                                                >
                                                    {item.name}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                                <div className='sm:col-span-6  lg:col-span-3'>
                                    <Label>
                                        Available Rooms
                                        <span className='text-error-500'>
                                            *
                                        </span>
                                    </Label>
                                    <div>
                                        <ButtonGroup2
                                            selectedRoomNumberList={
                                                item.selectedRoomNumber
                                            }
                                            isBtnPresent={
                                                item?.rooms?.length > 0
                                            }
                                            handleClick={handleSelectRoomNumber}
                                            btnList={item?.rooms?.map(
                                                (item2) => {
                                                    return {
                                                        btnText:
                                                            item2.roomNumber,
                                                        id: String(item2.id),
                                                        key: item.key,
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
                                <div className='sm:col-span-8  lg:col-span-3 flex items-center justify-between gap-4'>
                                    <Button
                                        onClick={() => {
                                            if (item?.roomTypeInfo) {
                                                handleOpenRoomInfoModal(
                                                    item?.roomTypeInfo
                                                );
                                            }
                                        }}
                                        size='xs'
                                        disabled={!item.roomTypeId}
                                        variant='outline'
                                    >
                                        <Info className='h-4 w-4 text-brand-500' />
                                        <span>See room type info</span>
                                    </Button>
                                    <Button
                                        disabled={!item.roomTypeId}
                                        size='xs'
                                        variant='primary'
                                    >
                                        <Calendar className='h-4 w-4 text-white' />
                                        <span>Check Availability</span>
                                    </Button>
                                    <Button
                                        size='xs'
                                        className='bg-orange-400 hover:bg-orange-300! '
                                    >
                                        <X className='h-4 w-4 text-white' />
                                        <span>Remove</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
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
