import * as yup from "yup";

import {
  IPriorityOptions,
  IStatusOptions,
  ITaskPayload,
  IUploadFile,
  Priority,
  TaskStatus,
  priorityOptions,
  statusOptions,
} from "@/types/user.types";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  useCreateTasksMutation,
  useCreateUploadsMutation,
  useGetLabelsQuery,
  useGetProjectsQuery,
  useGetSprintsQuery,
  useGetUsersQuery,
  useLazyGetProjectByIdQuery,
} from "@/store/api";

import Dropzone from "../Dropzone";
import RectTextEditor from "../RectTextEditor";
import Spinner from "../Spinner";
import TextEditor from "../TextEditor";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";

interface IFormInput {
  title: string;
  assignTo: number;
  assignedBy: number;
  status: TaskStatus;
  priority: Priority;
  sprint: number;
  project: number;
  label: number;
}

type Props = {
  onClose: () => void;
};

const TaskModal = (props: Props) => {
  const { onClose } = props;
  const { id: projectIdFromParams } = useParams();
  const [createTasksMutation] = useCreateTasksMutation();
  const [fetchProject] = useLazyGetProjectByIdQuery();
  const [files, setFiles] = useState<File[]>([]);
  const [OldFiles, setOldFiles] = useState<IUploadFile[]>([]);
  const editorPlaceholder = `Type here...`;
  const [editorContent, setEditorContent] = useState(editorPlaceholder);
  const [createUploadMutation] = useCreateUploadsMutation();

  const { isFetching: isLabelFetching, data: labelList } = useGetLabelsQuery({
    isPaginationEnabled: false,
    page: 1,
    pageSize: 10,
    isActive: true,
  });
  const { isFetching: isUserFetching, data: userList } = useGetUsersQuery();
  const { data: sprintList, isFetching: isSprintFetching } = useGetSprintsQuery(
    {
      isPaginationEnabled: false,
      page: 1,
      pageSize: 10,
      isActive: true,
    },
  );

  const { data: projectList, isFetching: isProjectFetching } =
    useGetProjectsQuery({
      isPaginationEnabled: false,
      page: 1,
      pageSize: 10,
    });
  const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    priority: yup.string(),
    status: yup.string(),
    assignTo: yup.number(),
    sprint: yup.number(),
    project: yup.number().optional(),
    label: yup.number(),
  });

  const defaultValues: IFormInput = {
    title: "",
    priority: "MEDIUM",
    assignTo: 1,
    assignedBy: 1,
    status: "TODO",
    sprint: 2,
    label: 1,
    project: Number(projectIdFromParams) ?? 1,
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
    console.log({
      editorContent,
    });

    try {
      const payload: ITaskPayload = {
        title: data.title,
        priority: data.priority,
        assignTo: Number(data.assignTo),
        addedDate: new Date(),
        addedBy: Number(data.assignedBy),
        assignedBy: Number(data.assignedBy),
        status: data.status,
        project: Number(projectIdFromParams),
        taskLabel: data.label,
        description: editorContent === editorPlaceholder ? "" : editorContent,
        taskUploads: [],
      };

      if (files?.length > 0) {
        const fileResponseList = await Promise.all(
          files.map(async (file: File) => {
            const response = await createUploadMutation({
              files: [file],
            }).unwrap();
            return response;
          }),
        );

        payload.taskUploads = fileResponseList.map((items) => {
          return items.data.id;
        });
      }

      const response = await createTasksMutation(payload).unwrap();
      console.log("response", response);

      if (response?.success) {
        fetchProject({
          projectId: Number(projectIdFromParams) || 0,
        });
        toast.success("Task added successfully");
        onClose();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong!");
    }
  };

  // max-h-[700px] overflow-y-auto

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-h-[700px] overflow-y-auto bg-white px-4 pb-4"
      >
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
          <div>
            {/* <TextEditor
              setEditorContent={setEditorContent}
              editorContent={editorContent}
            /> */}
            <RectTextEditor setValue={setEditorContent} value={editorContent} />
          </div>
          {/* <textarea
            {...register("description")}
            className="focus:shadow-outline w-full resize-y rounded-md border border-gray-200 p-2 text-gray-700 focus:border-blue-300 focus:outline-none"
          ></textarea> */}
        </div>
        <div className="mb-4">
          <Dropzone
            setFiles={setFiles}
            files={files}
            OldFiles={OldFiles}
            setOldFiles={setOldFiles}
          />
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

        <div className="flex w-full gap-4">
          <div className="mb-4 w-1/2">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Assign By
            </label>
            <div className="relative">
              <select
                className="block w-full appearance-none rounded border border-gray-200 bg-white px-4 py-2 pr-8 leading-tight text-gray-700 focus:border-blue-300 focus:bg-white focus:outline-none"
                id="grid-state"
                {...register("assignedBy")}
              >
                {!isUserFetching && userList?.data && userList?.data?.length > 0
                  ? userList?.data.map((item) => {
                      return (
                        <option value={item.id} key={item.id}>
                          {`${item.firstName} ${item.lastName}`}
                        </option>
                      );
                    })
                  : []}
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
              Assign to
            </label>
            <div className="relative">
              <select
                className="block w-full appearance-none rounded border border-gray-200 bg-white px-4 py-2 pr-8 leading-tight text-gray-700 focus:border-blue-300 focus:bg-white focus:outline-none"
                id="grid-state"
                {...register("assignTo")}
              >
                {!isUserFetching && userList?.data && userList?.data?.length > 0
                  ? userList?.data.map((item) => {
                      return (
                        <option value={item.id} key={item.id}>
                          {`${item.firstName} ${item.lastName}`}
                        </option>
                      );
                    })
                  : []}
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

        <div className="flex w-full gap-4">
          <div className="mb-4 w-1/2">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Label
            </label>
            <select
              className="block w-full appearance-none rounded border border-gray-200 bg-white px-4 py-2 pr-8 leading-tight text-gray-700 focus:border-blue-300 focus:bg-white focus:outline-none"
              id="grid-state"
              {...register("label")}
            >
              {!isLabelFetching &&
              labelList?.data &&
              labelList?.data?.result?.length > 0
                ? labelList?.data.result?.map((item) => {
                    return (
                      <option
                        className="text-capitalize"
                        value={item.id}
                        key={item.id}
                      >
                        {item.name}
                      </option>
                    );
                  })
                : []}
            </select>
          </div>
          <div className="mb-4 w-1/2">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Sprint
            </label>
            <select
              className="block w-full appearance-none rounded border border-gray-200 bg-white px-4 py-2 pr-8 leading-tight text-gray-700 focus:border-blue-300 focus:bg-white focus:outline-none"
              id="grid-state"
              {...register("sprint")}
            >
              {!isSprintFetching &&
              sprintList?.data &&
              sprintList?.data?.result?.length > 0
                ? sprintList?.data?.result.map((item) => {
                    return (
                      <option value={item.id} key={item.id}>
                        {item.name}
                      </option>
                    );
                  })
                : []}
            </select>
          </div>
        </div>
        {!projectIdFromParams && (
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Project
            </label>
            <select
              className="block w-full appearance-none rounded border border-gray-200 bg-white px-4 py-2 pr-8 leading-tight text-gray-700 focus:border-blue-300 focus:bg-white focus:outline-none"
              id="grid-state"
              {...register("project")}
            >
              {!isProjectFetching &&
              projectList?.data &&
              projectList?.data?.result?.length > 0
                ? projectList?.data.result?.map((item) => {
                    return (
                      <option value={item.id} key={item.id}>
                        {item.id} : {item.name}
                      </option>
                    );
                  })
                : []}
            </select>
          </div>
        )}
      </form>
      <div className="flex items-center justify-end gap-4">
        <button
          onClick={onClose}
          className="focus:shadow-outline rounded bg-gray-100 px-4 py-2 font-bold text-gray-500 hover:text-gray-800"
        >
          Cancel
        </button>
        <button
          disabled={isSubmitting}
          onClick={handleSubmit(onSubmit)}
          className={` ${isSubmitting ? "opacity-50" : ""} focus:shadow-outline rounded bg-blue-500 px-8 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none`}
          type="submit"
        >
          {isSubmitting ? <Spinner /> : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default TaskModal;
