import Badge from "@/components/ui/Badge";
import { FacilityOptions } from "@/constant/Hotel";
import type { IRoomTypeResponse } from "@/types/hotel.type";

type IProps = {
    selectedRoomTypeInfo: IRoomTypeResponse | undefined;
};

const RoomTypeInfo = (props: IProps) => {
    const { selectedRoomTypeInfo } = props;
    return (
        <div className='relative w-[600px] p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-6'>
            <div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between'>
                <div>
                    <h4 className='text-lg font-semibold text-gray-800 lg:mb-6 dark:text-white/90'>
                        Room Type Information
                    </h4>
                    <div className='grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32'>
                        <div className='col-span-2'>
                            <p className=' mb-2 text-md leading-normal text-gray-500 dark:text-gray-400'>
                                Room Type Name
                            </p>
                            <p className='text-md font-medium text-gray-800 dark:text-white/90'>
                                {selectedRoomTypeInfo?.name}
                            </p>
                        </div>
                        <div>
                            <p className='mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400'>
                                Price
                            </p>
                            <p className='text-sm font-medium text-gray-800 dark:text-white/90'>
                                {selectedRoomTypeInfo?.roomPrice}
                            </p>
                        </div>
                        <div>
                            <p className='mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400'>
                                Total Number of room Available
                            </p>
                            <p className='text-sm font-medium text-gray-800 dark:text-white/90'>
                                {selectedRoomTypeInfo?.total_number_of_rooms}
                            </p>
                        </div>
                        <div className='col-span-2'>
                            <p className='mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400'>
                                Facilities
                            </p>
                            <div className='flex flex-warp gap-4 '>
                                {selectedRoomTypeInfo?.facilities?.map(
                                    (item) => (
                                        <Badge
                                            key={item}
                                            badgeType='success'
                                            title={
                                                FacilityOptions.find(
                                                    (option) =>
                                                        option.key === item
                                                )?.label || ""
                                            }
                                        />
                                    )
                                )}
                            </div>
                        </div>
                        <div className='col-span-2'>
                            <p className='mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400'>
                                Rooms
                            </p>
                            <div className='flex flex-warp gap-4 '>
                                {selectedRoomTypeInfo?.rooms?.map((item) => (
                                    <div className='text-teal-700 text-md font-semibold bg-gray-100 px-2  rounded-lg'>
                                        {item.roomNumber}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className='col-span-2'>
                            <p className='mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400'>
                                Description
                            </p>
                            <p className='text-sm font-medium text-gray-800 dark:text-white/90'>
                                {selectedRoomTypeInfo?.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomTypeInfo;
