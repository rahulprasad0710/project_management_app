import * as yup from "yup";

import type {
    IRoomPayload,
    IRoomResponse,
    IRoomUpdatePayload,
} from "@/types/hotel.type";
import {
    useCreateRoomsMutation,
    useUpdateRoomsMutation,
} from "@api/hooks/hotel/useRoom";
import { useEffect, useState } from "react";

import Label from "@/components/form/Label";
import { PlusIcon } from "lucide-react";
import { Spinner } from "@/components/atoms/Spinner";
import type { SubmitHandler } from "react-hook-form";
import Switch from "@/components/form/switch/Switch";
import { inputFieldClass } from "@/utils/style";
import { toast } from "react-toastify";
import { useAppSelector } from "@/store/reduxHook";
import { useForm } from "react-hook-form";
import { useGetRoomTypesQuery } from "@api/hooks/hotel/useRoomType";
import { yupResolver } from "@hookform/resolvers/yup";

type Props = {
    selectedData: undefined | IRoomResponse;
    setSelectedData: (data: IRoomResponse | undefined) => void;
    handleCloseModal: () => void;
};

interface IFormInput {
    roomNumber: string;
    roomType: string;
    internalCompanyId: string;
}

const RoomModal = (props: Props) => {
    const { selectedData, handleCloseModal } = props;
    const authenticatedEmployee = useAppSelector(
        (state) => state.global.authenticateEmployee
    );
    const { data: roomTypeList, isFetching } = useGetRoomTypesQuery({
        isPaginationEnabled: false,
        isActive: true,
        page: 1,
        pageSize: 10,
        keyword: "",
    });

    const [createMutation] = useCreateRoomsMutation();
    const [updateMutation] = useUpdateRoomsMutation();

    const [isRoomActive, setIsRoomActive] = useState<boolean>(true);

    const defaultValues: IFormInput = {
        roomNumber: "",
        roomType: "",
        internalCompanyId: "",
    };

    const schema = yup.object().shape({
        roomNumber: yup.string().required("Room type name is required"),
        roomType: yup.string().required("Select room type."),
        internalCompanyId: yup.string().required("Select Internal Company."),
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<IFormInput>({
        resolver: yupResolver(schema),
        defaultValues: defaultValues,
    });

    useEffect(() => {
        if (selectedData?.id) {
            reset({
                roomNumber: selectedData.roomNumber,
                roomType: String(selectedData?.roomType?.id),
                internalCompanyId: String(selectedData?.internal_company_id),
            });
            setIsRoomActive(selectedData?.isActive);
        }
    }, [selectedData]);

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        try {
            const payload: IRoomPayload | IRoomUpdatePayload = {
                roomNumber: data.roomNumber,
                roomTypeId: Number(data.roomType),
                isActive: isRoomActive,
                internalCompanyId: Number(data.internalCompanyId),
            };

            if (selectedData?.id) {
                const updatePayload: IRoomUpdatePayload = {
                    ...payload,
                    id: selectedData.id,
                };

                const response = await updateMutation(updatePayload).unwrap();
                if (response.success) {
                    toast.success("Employee updated successfully");
                    handleCloseModal();
                }
            } else {
                const addPayload: IRoomPayload = {
                    ...payload,
                };
                const response = await createMutation(addPayload).unwrap();
                if (response.success) {
                    toast.success("New employee added successfully");
                    handleCloseModal();
                }
            }
        } catch (error) {
            console.log(error);
            toast.error("Something Went Wrong!");
        }
    };

    return (
        <div className='relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-6'>
            <div className='flex gap-2 w-full  items-center mb-2 text-gray-800 dark:text-white/90'>
                <PlusIcon />
                <h4 className=' text-xl font-semibold '>Add Room Type</h4>
            </div>

            <form
                className='bg-white px-4 py-4 dark:bg-slate-800'
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className='grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-4 mb-4'>
                    <div className='col-span-4'>
                        <Label>
                            Room name
                            <span className='text-error-500'>*</span>
                        </Label>
                        <div className='relative'>
                            <input
                                className={inputFieldClass({
                                    error: errors.roomNumber ? true : false,
                                })}
                                {...register("roomNumber", {
                                    required: true,
                                })}
                            />
                            {errors.roomNumber && (
                                <span className='text-error-400 text-sm'>
                                    {errors.roomNumber.message}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className='grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1 mb-4'>
                    <div>
                        <Label>
                            Room Type
                            <span className='text-error-500'>*</span>
                        </Label>
                        <div className='relative'>
                            <select
                                className='block w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 pr-8 leading-tight text-gray-700 focus:border-blue-300 focus:bg-white focus:outline-none'
                                {...register("roomType", { required: true })}
                            >
                                <option value='' disabled>
                                    Select Room Type
                                </option>
                                {roomTypeList?.data?.result.map((role) => (
                                    <option
                                        value={String(role.id)}
                                        key={role.id}
                                    >
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
                                <svg
                                    className='h-4 w-4 fill-current'
                                    xmlns='http://www.w3.org/2000/svg'
                                    viewBox='0 0 20 20'
                                >
                                    <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
                                </svg>
                            </div>
                        </div>
                        {errors.roomType && (
                            <span className='text-error-400 text-sm'>
                                {errors.roomType?.message}
                            </span>
                        )}
                    </div>
                </div>
                <div className='grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1 mb-4'>
                    <div>
                        <Label>
                            Internal Company
                            <span className='text-error-500'>*</span>
                        </Label>
                        <div className='relative'>
                            <select
                                className='block w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 pr-8 leading-tight text-gray-700 focus:border-blue-300 focus:bg-white focus:outline-none'
                                {...register("internalCompanyId", {
                                    required: true,
                                })}
                            >
                                <option value='' disabled>
                                    Select Internal Company
                                </option>
                                {authenticatedEmployee?.companyInfo.map(
                                    (company) => (
                                        <option
                                            value={String(
                                                company.internal_company_id
                                            )}
                                            key={company.internal_company_id}
                                        >
                                            {company.internal_company_name}
                                        </option>
                                    )
                                )}
                            </select>
                            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
                                <svg
                                    className='h-4 w-4 fill-current'
                                    xmlns='http://www.w3.org/2000/svg'
                                    viewBox='0 0 20 20'
                                >
                                    <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
                                </svg>
                            </div>
                        </div>
                        {errors.roomType && (
                            <span className='text-error-400 text-sm'>
                                {errors.roomType?.message}
                            </span>
                        )}
                    </div>
                </div>

                <div className='mt-4 flex items-center justify-between gap-4'>
                    <div className='relative'>
                        <Switch
                            defaultChecked={isRoomActive}
                            onChange={() => {
                                setIsRoomActive(!isRoomActive);
                            }}
                            label='Activate Room'
                        />
                    </div>
                    <div className='flex items-center  gap-4'>
                        <button
                            onClick={handleCloseModal}
                            className='focus:shadow-outline rounded bg-gray-100 px-4 py-2 font-bold text-gray-500 hover:text-gray-800'
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit(onSubmit)}
                            disabled={isSubmitting}
                            className={` ${
                                isSubmitting ? "opacity-50" : ""
                            } focus:shadow-outline rounded bg-blue-500 px-8 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none`}
                        >
                            {isSubmitting ? (
                                <Spinner />
                            ) : (
                                <span>
                                    {" "}
                                    {selectedData?.id
                                        ? "Update"
                                        : "Submit"}{" "}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default RoomModal;
