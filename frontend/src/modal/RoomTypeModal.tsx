import * as yup from "yup";

import type {
    IRoomTypePayload,
    IRoomTypeResponse,
    IRoomTypeUpdatePayload,
} from "@/types/hotel.type";
import {
    useCreateRoomTypesMutation,
    useUpdateRoomTypesMutation,
} from "@api/hooks/hotel/useRoomType";
import {
    useCreateUploadsMutation,
    useLazyGetUploadsUrlByIdQuery,
} from "@/api/hooks/useUpload";
import { useEffect, useState } from "react";

import { CloseIcon } from "@/icons";
import { FacilityOptions } from "@/constant/Hotel";
import FileInput from "@/components/form/input/FileInput";
import type { IMultiList } from "@/types/config.types";
import Label from "@/components/form/Label";
import MultiSelect from "@/components/atoms/MultiSelect";
import { PlusIcon } from "lucide-react";
import { Spinner } from "@/components/atoms/Spinner";
import type { SubmitHandler } from "react-hook-form";
import Switch from "@/components/form/switch/Switch";
import { inputFieldClass } from "@/utils/style";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

type Props = {
    selectedData: undefined | IRoomTypeResponse;
    setSelectedData: (data: IRoomTypeResponse | undefined) => void;
    handleCloseModal: () => void;
};

interface IFormInput {
    name: string;
    roomPrice: string;
    total_number_of_rooms: string;
    description: string;
}

const RoomTypeModal = (props: Props) => {
    const { selectedData, handleCloseModal } = props;

    const [imageError, setImageError] = useState<boolean>(false);

    const [selectedFacilities, setSelectedFacilities] = useState<IMultiList[]>(
        []
    );

    const [fetchUpload, { data: thumbnailData }] =
        useLazyGetUploadsUrlByIdQuery();

    const [createMutation] = useCreateRoomTypesMutation();
    const [updateMutation] = useUpdateRoomTypesMutation();
    const [createUploadMutation] = useCreateUploadsMutation();

    const [files, setFiles] = useState<File[]>([]);

    const [isRoomActive, setIsRoomActive] = useState<boolean>(true);

    const defaultValues: IFormInput = {
        name: "",
        description: "",
        roomPrice: "",
        total_number_of_rooms: "",
    };

    const schema = yup.object().shape({
        name: yup.string().required("Room type name is required"),
        description: yup.string().default(""),
        roomPrice: yup.string().required("Room price is required"),
        total_number_of_rooms: yup
            .string()
            .required("Total number of rooms is required"),
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
                name: selectedData.name,
                description: selectedData.description,
            });

            if (selectedData?.thumbnailUrlId) {
                fetchUpload({
                    uploadId: selectedData.thumbnailUrlId,
                });
            }
        }
    }, [selectedData]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (event.target.files && event.target.files.length > 0 && file) {
            setImageError(false);
            setFiles([file]);
        }
    };

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        try {
            console.log(files);

            if (files?.length === 0) {
                setImageError(true);
                return;
            }
            const payload: IRoomTypePayload | IRoomTypeUpdatePayload = {
                name: data.name,
                description: data.description,
                roomPrice: Number(data.roomPrice),
                total_number_of_rooms: Number(data.total_number_of_rooms),
                facilities:
                    selectedFacilities?.length > 0
                        ? selectedFacilities?.map((item) => String(item.value))
                        : [],
                thumbnailUrl: "",
                isActive: isRoomActive,
            };

            if (files?.length > 0) {
                const fileResponseList = await Promise.all(
                    files.map(async (file: File) => {
                        const response = await createUploadMutation({
                            files: [file],
                        }).unwrap();
                        return response;
                    })
                );

                if (fileResponseList.length > 0) {
                    payload.thumbnailUrl = fileResponseList[0].data.id;
                }
            }
            if (selectedData?.id) {
                const updatePayload: IRoomTypeUpdatePayload = {
                    ...payload,
                    id: selectedData.id,
                };

                const response = await updateMutation(updatePayload).unwrap();
                if (response.success) {
                    toast.success("Employee updated successfully");
                    handleCloseModal();
                }
            } else {
                const addPayload: IRoomTypePayload = {
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
            <div className='flex gap-4 align-bottom'>
                {thumbnailData?.data?.url && (
                    <div className='object-cover'>
                        <img
                            className='shadow-sm'
                            src={thumbnailData?.data?.url}
                            alt={"upload"}
                            style={{
                                width: "120px",
                                height: "120px",
                                objectFit: "cover",
                                borderRadius: "8px",
                            }}
                        />
                    </div>
                )}
                {files.map((file, index) => (
                    <div
                        className='relative my-4 object-cover '
                        key={index}
                        style={{ textAlign: "center" }}
                    >
                        <div>
                            <button
                                className=' sm:left-[-10px] sm:top-[-10px] sm:h-5 sm:w-5 absolute left-[-10px] top-[-10px] z-999 flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white '
                                onClick={() =>
                                    setFiles(
                                        files.filter((_, i) => i !== index)
                                    )
                                }
                            >
                                <CloseIcon />
                            </button>
                        </div>
                        <img
                            className='shadow-sm'
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index}`}
                            style={{
                                width: "120px",
                                height: "120px",
                                objectFit: "cover",
                                borderRadius: "8px",
                            }}
                        />
                        <p style={{ fontSize: "12px", marginTop: "4px" }}>
                            {file.name}
                        </p>
                    </div>
                ))}
            </div>
            <form
                className='bg-white px-4 py-4 dark:bg-slate-800'
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className='grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-4 mb-4'>
                    <div className='col-span-4'>
                        <Label>
                            Thumbnail
                            <span className='text-error-500'>*</span>
                        </Label>
                        <FileInput
                            onChange={handleFileChange}
                            className='custom-class'
                            acceptFileType='image/*'
                        />
                        {imageError && (
                            <span className='text-error-400 text-sm'>
                                Thumbnail is required.
                            </span>
                        )}
                    </div>
                    <div className='col-span-4'>
                        <Label>
                            Room type name
                            <span className='text-error-500'>*</span>
                        </Label>
                        <div className='relative'>
                            <input
                                className={inputFieldClass({
                                    error: errors.name ? true : false,
                                })}
                                {...register("name", {
                                    required: true,
                                })}
                            />
                            {errors.name && (
                                <span className='text-error-400 text-sm'>
                                    {errors.name.message}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className='col-span-4'>
                        <Label>Description</Label>
                        <div className='relative'>
                            <input
                                type='text'
                                className={inputFieldClass({
                                    error: errors.description ? true : false,
                                })}
                                {...register("description", {
                                    required: true,
                                })}
                            />
                            {errors.description && (
                                <span className='text-error-400 text-sm'>
                                    {errors.description.message}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className='col-span-2'>
                        <Label>
                            Price
                            <span className='text-error-500'>*</span>
                        </Label>
                        <div className='relative'>
                            <input
                                type='number'
                                className={inputFieldClass({
                                    error: errors.roomPrice ? true : false,
                                })}
                                {...register("roomPrice", {
                                    required: true,
                                })}
                            />
                            {errors.roomPrice && (
                                <span className='text-error-400 text-sm'>
                                    {errors?.roomPrice?.message}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className='col-span-2'>
                        <Label>
                            Total number of rooms
                            <span className='text-error-500'>*</span>
                        </Label>
                        <div className='relative'>
                            <input
                                type='number'
                                className={inputFieldClass({
                                    error: errors.total_number_of_rooms
                                        ? true
                                        : false,
                                })}
                                {...register("total_number_of_rooms", {
                                    required: true,
                                })}
                            />
                            {errors.total_number_of_rooms && (
                                <span className='text-error-400 text-sm'>
                                    {errors?.total_number_of_rooms?.message}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className='grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1 mb-4'>
                    <div>
                        <Label>
                            Facilities
                            <span className='text-error-500'>*</span>
                        </Label>
                        <div className='relative'>
                            <MultiSelect
                                list={FacilityOptions.map((item) => {
                                    return {
                                        value: item.key,
                                        label: item.label,
                                    };
                                })}
                                required={true}
                                selectedList={selectedFacilities}
                                setSelectList={setSelectedFacilities}
                                placeholder='Please facilities'
                                size={2}
                            />
                        </div>
                    </div>
                </div>

                <div className='mt-4 flex items-center justify-between gap-4'>
                    <div className='relative'>
                        <Switch
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

export default RoomTypeModal;
