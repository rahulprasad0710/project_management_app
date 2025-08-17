import * as yup from "yup";

import { Calendar, Info, PlusCircleIcon } from "lucide-react";
import type {
    ICustomerResponse,
    IRoomResponse,
    IRoomTypeResponse,
} from "@/types/hotel.type";
import {
    useLazyGetRoomTypesByIdQuery,
    useLazyGetRoomTypesQuery,
} from "@api/hooks/hotel/useRoomType";

import Button from "@/components/ui/button/Button";
import ButtonGroup2 from "@/components/molecules/ButtonGroup2";
import CustomerInformation from "./components/CustomerInformation";
import InfiniteScrollSelect from "@/components/common/InfiniteLoading";
import Label from "@/components/form/Label";
import { Modal } from "@/components/common/Modal";
import RoomInformation from "./components/RoomInformation";
import RoomTypeInfo from "./components/RoomTypeInfo";
import Switch from "@/components/form/switch/Switch";
import { inputFieldClass } from "@/utils/style";
import { useForm } from "react-hook-form";
import { useGetRoomTypesQuery } from "@api/hooks/hotel/useRoomType";
import { useLazyGetAllCustomerQuery } from "@apiHooks/useCustomer";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";

interface IFormInput {
    name: string;
    email: string;
    mobileNumber: string;
}

const defaultValues: IFormInput = {
    name: "",
    email: "",
    mobileNumber: "",
};

type TSelectRoom = {
    roomTypeId: number;
    RoomIndex: number;
    rooms: IRoomResponse[];
    roomTypeInfo: IRoomTypeResponse;
};

const AddBookingPage = () => {
    const [fetchCustomerAll] = useLazyGetAllCustomerQuery();
    const [fetchRoomTypeInfoById] = useLazyGetRoomTypesByIdQuery();

    const [selectedRoomList, setSelectedRoomList] = useState<TSelectRoom[]>([]);

    const [selectedCustomer, setSelectedCustomer] = useState<
        ICustomerResponse | undefined
    >();
    const { data: roomList } = useGetRoomTypesQuery({
        isPaginationEnabled: false,
        page: 1,
        pageSize: 10,
        isActive: true,
    });

    const schema = yup.object().shape({
        name: yup.string().required("Name is required"),
        email: yup.string().required("Email is required"),
        mobileNumber: yup.string().required("Mobile number is required"),
    });

    const [isNewCustomer, setIsNewCustomer] = useState(true);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<IFormInput>({
        defaultValues: defaultValues,
        resolver: yupResolver(schema),
    });

    console.log(watch("roomTypeId"));
    const handleSelectRoomType = async (
        roomTypeId: string,
        roomIndex: number
    ) => {
        const response = await fetchRoomTypeInfoById({
            roomTypesId: Number(roomTypeId),
        }).unwrap();

        const ifRoomTypePresent = selectedRoomList.findIndex(
            (item) => Number(item.roomTypeId) === response?.data?.id
        );

        if (ifRoomTypePresent !== -1) {
            selectedRoomList.splice(ifRoomTypePresent, 1);
        }

        selectedRoomList.push({
            roomTypeId: response?.data?.id,
            RoomIndex: roomIndex,
            rooms: response?.data?.rooms,
            roomTypeInfo: response?.data,
        });

        setSelectedRoomList([...selectedRoomList]);
    };

    return (
        <div className='rounded-md border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]'>
            <div className='flex flex-col justify-end md:justify-between gap-5  px-5 py-4 sm:flex-row sm:items-center '>
                <div>
                    <h3 className='text-lg font-semibold text-gray-800 dark:text-white/90'>
                        Bookings
                    </h3>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                        Add/Edit bookings
                    </p>
                </div>
                <div className='flex gap-12 items-center'>
                    <InfiniteScrollSelect<ICustomerResponse>
                        fetchAll={fetchCustomerAll}
                        getOptionLabel={(item) => {
                            return `${item?.mobileNumber}`;
                        }}
                        getOptionValue={(item) => item?.id}
                        preselectedValue={undefined}
                        onSelect={(item) => setSelectedCustomer(item)}
                        placeholder={"Select customer"}
                        isSelectDisabled={false}
                    />
                    <Switch
                        onChange={() => setIsNewCustomer((prev) => !prev)}
                        defaultChecked={isNewCustomer}
                        label='New Customer'
                    />
                </div>
            </div>
            <div className='rounded-lg border border-gray-200 p-5 lg:p-6 dark:border-gray-800 mb-8'>
                {isNewCustomer ? (
                    <div>
                        <h4 className='text-lg font-semibold text-gray-800 lg:mb-6 dark:text-white/90'>
                            Customer Information
                        </h4>
                        <div className='grid grid-cols-3 gap-8 mb-4'>
                            <div>
                                <Label>
                                    Customer's Name
                                    <span className='text-error-500'>*</span>
                                </Label>
                                <div className='relative'>
                                    <input
                                        className={inputFieldClass({
                                            error: errors.name ? true : false,
                                        })}
                                        type='text'
                                        placeholder='Enter Name'
                                        {...register("name", {
                                            required: true,
                                        })}
                                    />
                                    {errors.name && (
                                        <p className='text-xs italic text-red-500'>
                                            {errors.name?.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <Label>
                                    Mobile Number
                                    <span className='text-error-500'>*</span>
                                </Label>
                                <div className='relative'>
                                    <input
                                        className={inputFieldClass({
                                            error: errors.mobileNumber
                                                ? true
                                                : false,
                                        })}
                                        type='number'
                                        placeholder='Enter last name'
                                        {...register("mobileNumber", {
                                            required: true,
                                        })}
                                    />
                                    {errors.mobileNumber && (
                                        <p className='text-xs italic text-red-500'>
                                            {errors.mobileNumber?.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <Label>
                                    Email
                                    <span className='text-error-500'>*</span>
                                </Label>
                                <div className='relative'>
                                    <input
                                        className={inputFieldClass({
                                            error: errors.email ? true : false,
                                        })}
                                        type='text'
                                        placeholder='email address'
                                        {...register("email", {
                                            required: true,
                                        })}
                                    />
                                    {errors.email ? (
                                        <p className='text-xs italic text-red-500'>
                                            {errors.email?.message}
                                        </p>
                                    ) : (
                                        <p className='text-semibold text-xs text-blue-500'>
                                            Email cannot be changed after
                                            creation.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <CustomerInformation selectedCustomer={selectedCustomer} />
                )}
            </div>
            <RoomInformation />
        </div>
    );
};

export default AddBookingPage;
