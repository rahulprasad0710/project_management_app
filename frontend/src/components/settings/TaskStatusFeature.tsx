import {
    useCreateTaskStatusMutation,
    useUpdateTaskStatusMutation,
} from "@/api/hooks/useTaskStatus";
import { useEffect, useState } from "react";

import Button from "@/components/ui/button/Button";
import Checkbox from "../ui/Checkbox";
import type { ITaskStatusResponse } from "@/types/config.types";
import type { SubmitHandler } from "react-hook-form";
import { getCustomerError } from "@/utils/customError";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

type Props = {
    handleCloseModal: () => void;
    setSelectedData: React.Dispatch<
        React.SetStateAction<ITaskStatusResponse | undefined>
    >;
    selectedData: ITaskStatusResponse | undefined;
};

interface IFormInput {
    featureList: string[];
}

const TaskStatusFeatureModal = (props: Props) => {
    const { handleCloseModal, selectedData } = props;
    const [createMutation] = useCreateTaskStatusMutation();
    const [updateMutation] = useUpdateTaskStatusMutation();

    const defaultValues: IFormInput = {
        featureList: [],
    };

    const list = [
        {
            label: "Select Feature 1",
            value: "1",
        },
        {
            label: "Select Feature 2",
            value: "2",
        },
    ];

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<IFormInput>({
        defaultValues: defaultValues,
    });

    const handleSubmitForm: SubmitHandler<IFormInput> = async (data) => {
        console.log(data);
    };
    return (
        <div className='relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11 '>
            <div className='px-2 mb-2 flex gap-4 items-center'>
                <div
                    style={{
                        backgroundColor: selectedData?.color_code,
                        height: "20px",
                        width: "80px",
                    }}
                ></div>
                <h4 className=' text-xl font-semibold text-gary-800 dark:text-white/90  '>
                    {selectedData?.name}
                </h4>
            </div>
            <p className='mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7 px-2'>
                Assign task status to manage your feature.
            </p>
            <form
                onSubmit={handleSubmit(handleSubmitForm)}
                className='flex flex-col'
            >
                <div className='px-2 overflow-y-auto custom-scrollbar'>
                    <div className='grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1  '>
                        <div className='relative'>
                            {list.map((item) => (
                                <div className='mb-4' key={item.value}>
                                    <Checkbox<IFormInput>
                                        label={item.label}
                                        checked={true}
                                        register={register}
                                        onChange={() => {}}
                                        fromName='featureList'
                                    />
                                </div>
                            ))}
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

export default TaskStatusFeatureModal;
