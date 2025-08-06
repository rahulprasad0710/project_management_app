import * as yup from "yup";

import {
    useCreateTaskStatusMutation,
    useUpdateTaskStatusMutation,
} from "@/api/hooks/useTaskStatus";

import Button from "@/components/ui/button/Button";
import { Edit } from "lucide-react";
import type { ITaskStatusResponse } from "@/types/config.types";
import Label from "@/components/form/Label";
import type { SubmitHandler } from "react-hook-form";
import { getCustomerError } from "@/utils/customError";
import { inputFieldClass } from "@/utils/style";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

type Props = {
    handleCloseModal: () => void;
    setSelectedData: React.Dispatch<
        React.SetStateAction<ITaskStatusResponse | undefined>
    >;
    selectedData: ITaskStatusResponse | undefined;
};

interface IFormInput {
    colorCode: string;
    name: string;
}

const TaskStatusModal = (props: Props) => {
    const { handleCloseModal, selectedData } = props;
    const [createMutation] = useCreateTaskStatusMutation();
    const [updateMutation] = useUpdateTaskStatusMutation();

    const defaultValues: IFormInput = {
        colorCode: "",
        name: "",
    };

    const schema = yup.object().shape({
        name: yup.string().required("Task status name is required"),
        colorCode: yup.string().required("Color code is required"),
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
            reset({
                name: selectedData.name,
                colorCode: selectedData.color_code,
            });
        }
    }, [selectedData?.id]);

    const handleSubmitForm: SubmitHandler<IFormInput> = async (data) => {
        console.log(data);

        try {
            if (selectedData?.id) {
                const response = await updateMutation({
                    id: selectedData.id,
                    colorCode: data.colorCode,
                    name: data.name,
                }).unwrap();

                if (response?.success) {
                    toast.success("Task status updated successfully");
                    setToggle(false);
                }
            } else {
                const response = await createMutation({
                    colorCode: data.colorCode,
                    name: data.name,
                }).unwrap();
                console.log("response", response);

                if (response?.success) {
                    toast.success("Task status added successfully");
                    setToggle(false);
                }
            }
        } catch (err) {
            console.log(err);
            const error = getCustomerError(err);
            toast.error(error.message);
        }
    };
    return (
        <div className='relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11'>
            <div className='px-2 pr-14'>
                <h4 className='mb-2 text-xl font-semibold text-gray-800 dark:text-white/90'>
                    {selectedData ? "Edit" : "Add"} Task Status
                </h4>
                <p className='mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7'>
                    Add or edit task status to manage your feature/project
                    status.
                </p>
            </div>
            <form
                onSubmit={handleSubmit(handleSubmitForm)}
                className='flex flex-col'
            >
                <div className='px-2 overflow-y-auto custom-scrollbar'>
                    <div className='grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-4'>
                        <div className='col-span-3'>
                            <Label>
                                Task Status name{" "}
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
                                Color code{" "}
                                <span className='text-error-500'>*</span>
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
                </div>
                <div className='flex items-center gap-3 px-2 mt-6 lg:justify-end'>
                    <Button
                        size='sm'
                        variant='outline'
                        onClick={() => handleCloseModal()}
                    >
                        Close
                    </Button>

                    <Button
                        onClick={handleSubmit(handleSubmitForm)}
                        disabled={isSubmitting}
                        type='button'
                        size='sm'
                    >
                        {selectedData?.id ? "Update" : "Add"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default TaskStatusModal;
