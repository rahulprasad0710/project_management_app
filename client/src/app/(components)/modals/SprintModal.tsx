import * as yup from "yup";

import {
  ISprintPayload,
  ISprintResponse,
  ISprintUpdatePayload,
} from "@/types/user.types";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useCreateSprintMutation, useUpdateSprintMutation } from "@/store/api";

import Spinner from "../Spinner";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";

type Props = {
  onClose: () => void;
  selectedData: undefined | ISprintResponse;
  setSelectedData: (data: ISprintResponse | undefined) => void;
};

interface IFormInput {
  name: string;
  goal?: string;
  startDate: string;
  endDate: string;
}

const SprintModal = (props: Props) => {
  const { onClose, selectedData } = props;

  const [createSprintMutation] = useCreateSprintMutation();
  const [updateSprintMutation] = useUpdateSprintMutation();

  const schema = yup.object().shape({
    name: yup.string().required("Sprint name is required"),
    goal: yup.string(),
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
        startDate: selectedData.startDate,
        endDate: selectedData.endDate,
      });
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

        const response = await updateSprintMutation(updatePayload).unwrap();
        if (response.success) {
          toast.success("Project updated successfully");
          onClose();
        }
      } else {
        const addProjectPayload: ISprintPayload = {
          ...payload,
        };
        const response = await createSprintMutation(addProjectPayload).unwrap();
        if (response.success) {
          toast.success("Project added successfully");
          onClose();
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong!");
    }
  };

  return (
    <div>
      {" "}
      <form className="bg-white px-4 py-2" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-700">
            Name
          </label>
          <input
            className="focus:shadow-outline mb-2 w-full appearance-none rounded border border-gray-200 bg-white px-3 py-2 leading-tight text-gray-800 shadow-sm focus:border-blue-300 focus:outline-none"
            type="text"
            placeholder="name"
            {...register("name", { required: true })}
          />
          {errors.name && (
            <p className="text-xs italic text-red-500">
              {errors.name?.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-700">
            Goal
          </label>
          <textarea
            {...register("goal")}
            className="focus:shadow-outline w-full resize-y rounded-md border border-gray-200 p-2 text-gray-700 focus:border-blue-300 focus:outline-none"
          ></textarea>
        </div>

        <div className="flex w-full gap-4">
          <div className="mb-4 w-1/2">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Start Date
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow-sm focus:border-blue-300 focus:outline-none"
              type="date"
              defaultValue={new Date().toISOString().split("T")[0]}
              {...register("startDate")}
            />
          </div>
          <div className="mb-4 w-1/2">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              End Date
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow-sm focus:border-blue-300 focus:outline-none"
              type="date"
              defaultValue={new Date().toISOString().split("T")[0]}
              {...register("endDate")}
            />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-end gap-4">
          <button
            onClick={onClose}
            className="focus:shadow-outline rounded bg-gray-100 px-4 py-2 font-bold text-gray-500 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            disabled={isSubmitting}
            className={` ${isSubmitting ? "opacity-50" : ""} focus:shadow-outline rounded bg-blue-500 px-8 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none`}
          >
            {!!isSubmitting && <Spinner />}
            <span> {selectedData?.id ? "Update" : "Submit"} </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SprintModal;
