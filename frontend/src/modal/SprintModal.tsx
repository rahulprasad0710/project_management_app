import * as yup from "yup";

import type {
    ISprintPayload,
    ISprintResponse,
    ISprintUpdatePayload,
} from "@/types/config.types";
import {
    useCreateSprintMutation,
    useUpdateSprintMutation,
} from "@apiHooks/useSprint";
import { useEffect, useState } from "react";

import CheckSwitch from "@/components/molecules/CheckSwitch";
import Label from "@/components/form/Label";
import ModalHeader from "@/components/atoms/ModalHeader";
import { Spinner } from "@/components/atoms/Spinner";
import type { SubmitHandler } from "react-hook-form";
import { inputFieldClass } from "@/utils/style";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

type Props = {
    handleCloseModal: () => void;
    selectedData: undefined | ISprintResponse;
    setSelectedData: (data: ISprintResponse | undefined) => void;
};

interface IFormInput {
    name: string;
    goal: string;
    startDate: string;
    endDate: string;
}

const SprintModal = (props: Props) => {
    const { handleCloseModal, selectedData } = props;
    const [isActive, setIsActive] = useState<boolean>(true);
    const [createSprintMutation] = useCreateSprintMutation();
    const [updateSprintMutation] = useUpdateSprintMutation();

    const schema = yup.object().shape({
        name: yup.string().required("Sprint name is required"),
        goal: yup.string().default(""),
        startDate: yup.string().required("Start date is required"),
        endDate: yup.string().required("End date  is required"),
    });

    const defaultValues: IFormInput = {
        name: "",
        goal: "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
    };

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
                goal: selectedData.goal,
                startDate: new Date(selectedData.startDate)
                    .toISOString()
                    .split("T")[0],
                endDate: new Date(selectedData.endDate)
                    .toISOString()
                    .split("T")[0],
            });
            setIsActive(selectedData?.isActive);
        }
    }, [selectedData]);

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        console.log(data);

        const payload: ISprintPayload | ISprintUpdatePayload = {
            name: data.name,
            goal: data.goal || "",
            startDate: data.startDate,
            endDate: data.endDate,
        };

        try {
            if (selectedData?.id) {
                const updatePayload: ISprintUpdatePayload = {
                    ...payload,
                    id: selectedData.id,
                };

                const response = await updateSprintMutation(
                    updatePayload
                ).unwrap();
                if (response.success) {
                    toast.success("Project updated successfully");
                    handleCloseModal();
                }
            } else {
                const addProjectPayload: ISprintPayload = {
                    ...payload,
                };
                const response = await createSprintMutation(
                    addProjectPayload
                ).unwrap();
                if (response.success) {
                    toast.success("Project added successfully");
                    handleCloseModal();
                }
            }
        } catch (error) {
            console.log(error);
            toast.error("Something Went Wrong!");
        }
    };

    return (
        <div className='relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-6 z-9'>
            <div className='px-2 pr-14'>
                <ModalHeader
                    title='Sprint'
                    isAdd={selectedData?.id ? false : true}
                />
            </div>
            <form
                className='bg-white px-4 py-4 dark:bg-slate-800'
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className='mb-4'>
                    <Label>
                        Sprint Name <span className='text-error-500'>*</span>
                    </Label>
                    <input
                        className={inputFieldClass({
                            error: errors.name ? true : false,
                        })}
                        type='text'
                        placeholder='name'
                        {...register("name", { required: true })}
                    />
                    {errors.name && (
                        <span className='text-error-400 text-sm'>
                            {errors.name.message}
                        </span>
                    )}
                </div>
                <div className='mb-4'>
                    <Label>Description</Label>
                    <div>
                        <input
                            type='text'
                            className={inputFieldClass({
                                error: errors.goal ? true : false,
                            })}
                            {...register("goal", {
                                required: true,
                            })}
                        />
                    </div>
                </div>

                <div className='flex w-full gap-4'>
                    <div className='mb-4 w-1/2'>
                        <label className='mb-2 block text-sm font-bold text-gray-700'>
                            Start Date
                        </label>
                        <input
                            className={inputFieldClass({
                                error: errors.startDate ? true : false,
                            })}
                            type='date'
                            {...register("startDate")}
                        />
                    </div>
                    <div className='mb-4 w-1/2'>
                        <label className='mb-2 block text-sm font-bold text-gray-700'>
                            End Date
                        </label>
                        <input
                            className={inputFieldClass({
                                error: errors.endDate ? true : false,
                            })}
                            type='date'
                            {...register("endDate")}
                        />
                    </div>
                </div>
                <div className='mt-4 flex items-center justify-between gap-4'>
                    <CheckSwitch
                        selectedChecked={isActive}
                        setSelectedChecked={setIsActive}
                        label='Active'
                    />
                    <div className='flex items-center justify-end gap-4'>
                        <button
                            onClick={handleCloseModal}
                            className='focus:shadow-outline rounded bg-gray-100 px-4 py-2 font-bold text-gray-500 hover:text-gray-800'
                        >
                            Cancel
                        </button>
                        <button
                            disabled={isSubmitting}
                            className={` ${
                                isSubmitting ? "opacity-50" : ""
                            } focus:shadow-outline rounded bg-blue-500 px-8 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none`}
                        >
                            {!!isSubmitting && <Spinner />}
                            <span>
                                {" "}
                                {selectedData?.id ? "Update" : "Submit"}{" "}
                            </span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SprintModal;
