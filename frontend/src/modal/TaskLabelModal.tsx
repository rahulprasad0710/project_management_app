import * as yup from "yup";

import type {
    ILabelPayload,
    ILabelResponse,
    ILabelUpdatePayload,
} from "@/types/config.types";
import {
    useCreateLabelMutation,
    useUpdateLabelMutation,
} from "@api/hooks/useLabel";
import { useEffect, useState } from "react";

import CheckSwitch from "@/components/molecules/CheckSwitch";
import Label from "@/components/form/Label";
import ModalHeader from "@/components/atoms/ModalHeader";
import { Spinner } from "@/components/atoms/Spinner";
import type { SubmitHandler } from "react-hook-form";
import Switch from "@/components/form/switch/Switch";
import { inputFieldClass } from "@/utils/style";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

type Props = {
    selectedData: undefined | ILabelResponse;
    setSelectedData: (data: ILabelResponse | undefined) => void;
    handleCloseModal: () => void;
};

interface IFormInput {
    colorCode: string;
    name: string;
    description: string;
}

const TaskLabelModal = (props: Props) => {
    const { selectedData, handleCloseModal } = props;
    const [isActive, setIsActive] = useState<boolean>(true);

    const [createMutation] = useCreateLabelMutation();
    const [updateMutation] = useUpdateLabelMutation();

    const defaultValues = {
        colorCode: "",
        name: "",
        description: "",
    };

    const schema = yup.object().shape({
        name: yup.string().required("Task status name is required"),
        colorCode: yup.string().required("Color code is required"),
        description: yup.string().default(""),
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<IFormInput>({
        defaultValues: defaultValues,
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if (selectedData?.id) {
            console.log({
                selectedDataActive: selectedData?.isActive,
            });
            reset({
                name: selectedData.name,
                colorCode: selectedData.colorCode,
                description: selectedData.description,
            });

            setIsActive(selectedData?.isActive);
        }
    }, [selectedData]);

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        console.log(data);

        const payload: ILabelPayload | ILabelUpdatePayload = {
            name: data.name,
            colorCode: data.colorCode,
            description: data.description,
            isActive: isActive,
        };

        try {
            if (selectedData?.id) {
                const updatePayload: ILabelUpdatePayload = {
                    ...payload,
                    id: selectedData.id,
                };

                const response = await updateMutation(updatePayload).unwrap();
                if (response.success) {
                    toast.success("Employee updated successfully");
                    handleCloseModal();
                }
            } else {
                const addPayload: ILabelPayload = {
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
            <div className='p-2 pb-3'>
                <ModalHeader isAdd={!selectedData?.id} title='Label' />
            </div>

            <form
                className='bg-white px-4 py-4 dark:bg-slate-800'
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className='grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-4 mb-4'>
                    <div className='col-span-3'>
                        <Label>
                            Label name
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
                    <div className='col-span-1'>
                        <Label>
                            Color code <span className='text-error-500'>*</span>
                        </Label>
                        <div className='relative'>
                            <input
                                type='color'
                                className={inputFieldClass({
                                    error: errors.colorCode ? true : false,
                                })}
                                {...register("colorCode", {
                                    required: true,
                                })}
                            />
                            {errors.colorCode && (
                                <span className='text-error-400 text-sm'>
                                    {errors.colorCode.message}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className='grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1 mb-4'>
                    <div>
                        <Label>
                            Description
                            <span className='text-error-500'>*</span>
                        </Label>
                        <div className='relative'>
                            <input
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
                </div>

                <div className='mt-4 flex items-center justify-between gap-4'>
                    <CheckSwitch
                        selectedChecked={isActive}
                        setSelectedChecked={setIsActive}
                        label='Active'
                    />
                    <div className='flex gap-4'>
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

export default TaskLabelModal;
