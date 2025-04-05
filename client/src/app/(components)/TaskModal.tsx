import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  useCreateTasksMutation,
  useLazyGetProjectByIdQuery,
} from "@/store/api";
import {
  Priority,
  TaskStatus,
  priorityOptions,
  IPriorityOptions,
  statusOptions,
  IStatusOptions,
  ITaskPayload,
} from "@/types/user.types";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import Spinner from "./Spinner";

interface IFormInput {
  title: string;
  description: string;
  priority: Priority;
  assignTo: number;
  startDate: Date;
  endDate: Date;
  addedBy: number;
  status: TaskStatus;
}

interface IAssignedTo {
  label: string;
  value: number;
}

type Props = {
  onClose: () => void;
};

const TaskModal = (props: Props) => {
  const { onClose } = props;
  const { id } = useParams();
  const [createTasksMutation] = useCreateTasksMutation();
  const [fetchProject] = useLazyGetProjectByIdQuery();

  const schema = yup.object().shape({
    title: yup.string().required("Title is required"), // Required field
    description: yup.string().optional(),
    priority: yup.string().optional(),
    startDate: yup.date().optional(), // Ensures undefined is allowed
    endDate: yup.date().optional(),
    addedBy: yup.number().optional(),
    status: yup.string().optional(),
    assignTo: yup.number().optional(),
  });

  const defaultValues: IFormInput = {
    title: "",
    description: "",
    priority: "MEDIUM",
    assignTo: 1,
    addedBy: 1,
    status: "TODO",
    startDate: new Date(),
    endDate: new Date(),
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IFormInput>({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log(data);

    const payload: ITaskPayload = {
      title: data.title,
      description: data.description,
      priority: data.priority,
      assignTo: Number(data.assignTo),
      startDate: data.startDate,
      endDate: data.endDate,
      addedBy: Number(data.addedBy),
      status: data.status,
      projectId: Number(id),
    };

    try {
      const response = await createTasksMutation(payload).unwrap();
      console.log("response", response);

      if (response) {
        fetchProject({
          projectId: Number(id) || 0,
        });
        toast.success("Task added successfully");
        onClose();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong!");
    }
  };

  const assignToOptions = [
    { value: 1, label: "John Doe" },
    { value: 2, label: "Jane Smith" },
    { value: 3, label: "Bob Johnson" },
  ];

  return (
    <div className="w-full">
      <form className="bg-white p-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-700">
            Title
          </label>
          <input
            className="focus:shadow-outline mb-2 w-full appearance-none rounded border border-gray-200 bg-white px-3 py-2 leading-tight text-gray-800 shadow-sm focus:border-blue-300 focus:outline-none"
            type="text"
            placeholder="title"
            {...register("title", { required: true })}
          />
          {errors.title && (
            <p className="text-xs italic text-red-500">
              {errors.title?.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-700">
            Description
          </label>
          <textarea
            {...register("description")}
            className="focus:shadow-outline w-full resize-y rounded-md border border-gray-200 p-2 text-gray-700 focus:border-blue-300 focus:outline-none"
          ></textarea>
        </div>
        <div className="flex w-full gap-4">
          <div className="mb-4 w-1/2">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Priority
            </label>
            <div className="relative">
              <select
                className="block w-full appearance-none rounded border border-gray-200 bg-white px-4 py-2 pr-8 leading-tight text-gray-700 focus:border-blue-300 focus:bg-white focus:outline-none"
                {...register("priority")}
              >
                {priorityOptions.map((priority: IPriorityOptions) => (
                  <option value={priority.value} key={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="h-4 w-4 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="mb-4 w-1/2">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Status
            </label>
            <div className="relative">
              <select
                className="block w-full appearance-none rounded border border-gray-200 bg-white px-4 py-2 pr-8 leading-tight text-gray-700 focus:border-blue-300 focus:bg-white focus:outline-none"
                {...register("status")}
              >
                {statusOptions.map((status: IStatusOptions) => (
                  <option value={status.value} key={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="h-4 w-4 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-4 w-full">
          <label className="mb-2 block text-sm font-bold text-gray-700">
            Report By
          </label>
          <div className="relative">
            <select
              className="block w-full appearance-none rounded border border-gray-200 bg-white px-4 py-2 pr-8 leading-tight text-gray-700 focus:border-blue-300 focus:bg-white focus:outline-none"
              id="grid-state"
              {...register("addedBy")}
            >
              {assignToOptions.map((assignTo: IAssignedTo) => (
                <option value={assignTo.value} key={assignTo.value}>
                  {assignTo.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="h-4 w-4 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="mb-4 w-full">
          <label className="mb-2 block text-sm font-bold text-gray-700">
            Assign to
          </label>
          <div className="relative">
            <select
              className="block w-full appearance-none rounded border border-gray-200 bg-white px-4 py-2 pr-8 leading-tight text-gray-700 focus:border-blue-300 focus:bg-white focus:outline-none"
              id="grid-state"
              {...register("assignTo")}
            >
              {assignToOptions.map((assignTo: IAssignedTo) => (
                <option value={assignTo.value} key={assignTo.value}>
                  {assignTo.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="h-4 w-4 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-700">
            Start Date
          </label>
          <input
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow-sm focus:border-blue-300 focus:outline-none"
            type="date"
            value={new Date().toISOString().split("T")[0]}
            {...register("startDate")}
          />
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-700">
            End Date
          </label>
          <input
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow-sm focus:border-blue-300 focus:outline-none"
            type="date"
            value={new Date().toISOString().split("T")[0]}
            {...register("endDate")}
          />
        </div>
        <div className="flex items-center justify-end gap-4">
          <button
            onClick={onClose}
            className="focus:shadow-outline rounded bg-gray-100 px-4 py-2 font-bold text-gray-500 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            disabled={isSubmitting}
            className={` ${isSubmitting ? "opacity-50" : ""} focus:shadow-outline rounded bg-blue-500 px-8 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none`}
            type="submit"
          >
            {isSubmitting ? <Spinner /> : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskModal;
