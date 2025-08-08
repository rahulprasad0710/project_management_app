import * as yup from "yup";

import type {
    IEmployeeResponse,
    IPriorityOptions,
    IStatusOptions,
    ITaskPayload,
    IUploadFile,
    Priority,
    TaskStatus,
} from "@/types/config.types";
import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";

import Dropzone from "@components/common/Dropzone";
import type { FeatureOutletContextType } from "@/types/state.types";
import { Spinner } from "../atoms/Spinner";
import type { SubmitHandler } from "react-hook-form";
import TextEditor from "@components/common/TextEditor";
import { priorityOptions } from "@/types/config.types";
import { statusOptions } from "@/constant/utils";
import { toast } from "react-toastify";
import { useCreateTasksMutation } from "@apiHooks/useTask";
import { useCreateUploadsMutation } from "@/api/hooks/useUpload";
import { useForm } from "react-hook-form";
import { useGetEmployeesQuery } from "@/api/hooks/useEmployee";
import { useGetLabelsQuery } from "@apiHooks/useLabel";
import { useGetSprintsQuery } from "@/api/hooks/useSprint";
import { yupResolver } from "@hookform/resolvers/yup";

interface IFormInput {
    title: string;
    priority: Priority;
    assignTo: number | undefined;
    assignedBy: number | undefined;
    status: TaskStatus;
    sprint: number;
    project: number | undefined;
    label: number | undefined;
}

type Props = {
    onClose: () => void;
};

const TaskModal = (props: Props) => {
    const { onClose } = props;
    const { id: projectIdFromParams } = useParams();
    const [createTasksMutation] = useCreateTasksMutation();
    const [files, setFiles] = useState<File[]>([]);
    const [OldFiles, setOldFiles] = useState<IUploadFile[]>([]);
    const editorPlaceholder = `Type here...`;
    const [editorContent, setEditorContent] = useState(editorPlaceholder);
    const [createUploadMutation] = useCreateUploadsMutation();

    const { selectedFeature, userId } =
        useOutletContext<FeatureOutletContextType>();

    const { isFetching: isLabelFetching, data: labelList } = useGetLabelsQuery({
        isPaginationEnabled: false,
        page: 1,
        pageSize: 10,
        isActive: true,
    });
    const { isFetching: isUserFetching, data: userList } = useGetEmployeesQuery(
        {
            isPaginationEnabled: false,
            page: 1,
            pageSize: 10,
            isActive: true,
        }
    );
    const { data: sprintList, isFetching: isSprintFetching } =
        useGetSprintsQuery({
            isPaginationEnabled: false,
            page: 1,
            pageSize: 10,
            isActive: true,
        });

    const schema = yup.object().shape({
        title: yup.string().required("Title is required"),
        priority: yup.mixed<Priority>().required("Priority is required"),
        status: yup.string(),
        assignTo: yup.number().optional(),
        sprint: yup.number(),
        assignedBy: yup.number(),
        project: yup.number().optional(),
        label: yup.number().optional(),
    });

    const defaultValues: IFormInput = {
        title: "",
        priority: "MEDIUM",
        assignTo: userId,
        assignedBy: undefined,
        status: "TODO",
        sprint: selectedFeature.features_sprint_id,
        label: undefined,
        project: undefined,
    };

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<IFormInput>({
        defaultValues: defaultValues,
        resolver: yupResolver(schema),
    });

    console.log("error", errors);

    useEffect(() => {
        if (sprintList && sprintList?.data?.result?.length > 0) {
            setValue("sprint", selectedFeature.features_sprint_id);
        }
    }, [selectedFeature.features_sprint_id, setValue, sprintList]);

    useEffect(() => {
        if (userList && userList?.data?.result?.length > 0) {
            setValue("assignTo", userId);
        }
    }, [
        selectedFeature.features_sprint_id,
        setValue,
        sprintList,
        userId,
        userList,
    ]);

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        try {
            console.log(data);
            console.log({
                editorContent,
            });
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
                description:
                    editorContent === editorPlaceholder ? "" : editorContent,
                taskUploads: [],
                featureId: selectedFeature.features_id,
                sprint: data.sprint,
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

                payload.taskUploads = fileResponseList.map((items) => {
                    return items.data.id;
                });
            }

            const response = await createTasksMutation(payload).unwrap();
            console.log("response", response);

            if (response?.success) {
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
        <div className='relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11'>
            <div className='px-2 pr-14'>
                <h4 className='mb-2 text-xl font-semibold text-gray-800 dark:text-white/90'>
                    Add Task
                </h4>
                <p className='mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7'>
                    Add or edit task status to manage your feature/project
                    status.
                </p>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className='max-h-[600px] overflow-y-auto bg-white px-4 pb-4'
            >
                <div className='mb-4'>
                    <label className='mb-2 block text-sm font-bold text-gray-700'>
                        Title
                    </label>
                    <input
                        className='focus:shadow-outline mb-2 w-full appearance-none rounded border border-gray-200 bg-white px-3 py-2 leading-tight text-gray-800 shadow-sm focus:border-blue-300 focus:outline-none'
                        type='text'
                        placeholder='title'
                        {...register("title", { required: true })}
                    />
                    {errors.title && (
                        <p className='text-xs italic text-red-500'>
                            {errors.title?.message}
                        </p>
                    )}
                </div>
                <div className='mb-4'>
                    <label className='mb-2 block text-sm font-bold text-gray-700'>
                        Description
                    </label>
                    <div>
                        {/* <TextEditor
              setEditorContent={setEditorContent}
              editorContent={editorContent}
            /> */}
                        <TextEditor
                            setValue={setEditorContent}
                            value={editorContent}
                        />
                    </div>
                    {/* <textarea
            {...register("description")}
            className="focus:shadow-outline w-full resize-y rounded-md border border-gray-200 p-2 text-gray-700 focus:border-blue-300 focus:outline-none"
          ></textarea> */}
                </div>
                <div className='mb-4'>
                    <Dropzone
                        setFiles={setFiles}
                        files={files}
                        OldFiles={OldFiles}
                        setOldFiles={setOldFiles}
                    />
                </div>
                <div className='flex w-full gap-4'>
                    <div className='mb-4 w-1/2'>
                        <label className='mb-2 block text-sm font-bold text-gray-700'>
                            Priority
                        </label>
                        <div className='relative'>
                            <select
                                className='block w-full appearance-none rounded border border-gray-200 bg-white px-4 py-2 pr-8 leading-tight text-gray-700 focus:border-blue-300 focus:bg-white focus:outline-none'
                                {...register("priority")}
                            >
                                {priorityOptions.map(
                                    (priority: IPriorityOptions) => (
                                        <option
                                            value={priority.value}
                                            key={priority.value}
                                        >
                                            {priority.label}
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
                    </div>
                    <div className='mb-4 w-1/2'>
                        <label className='mb-2 block text-sm font-bold text-gray-700'>
                            Status
                        </label>
                        <div className='relative'>
                            <select
                                className='block w-full appearance-none rounded border border-gray-200 bg-white px-4 py-2 pr-8 leading-tight text-gray-700 focus:border-blue-300 focus:bg-white focus:outline-none'
                                {...register("status")}
                            >
                                {statusOptions.map((status: IStatusOptions) => (
                                    <option
                                        value={status.value}
                                        key={status.value}
                                    >
                                        {status.label}
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
                    </div>
                </div>

                <div className='flex w-full gap-4'>
                    <div className='mb-4 w-1/2'>
                        <label className='mb-2 block text-sm font-bold text-gray-700'>
                            Assign By
                        </label>
                        <div className='relative'>
                            <select
                                className='block w-full appearance-none rounded border border-gray-200 bg-white px-4 py-2 pr-8 leading-tight text-gray-700 focus:border-blue-300 focus:bg-white focus:outline-none'
                                id='grid-state'
                                {...register("assignedBy")}
                            >
                                {!isUserFetching &&
                                userList?.data &&
                                userList?.data?.result?.length > 0
                                    ? userList?.data?.result.map(
                                          (item: IEmployeeResponse) => {
                                              return (
                                                  <option
                                                      value={item.id}
                                                      key={item.id}
                                                  >
                                                      {`${item.firstName} ${item.lastName}`}
                                                  </option>
                                              );
                                          }
                                      )
                                    : []}
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
                    </div>
                    <div className='mb-4 w-1/2'>
                        <label className='mb-2 block text-sm font-bold text-gray-700'>
                            Assign to
                        </label>
                        <div className='relative'>
                            <select
                                className='block w-full appearance-none rounded border border-gray-200 bg-white px-4 py-2 pr-8 leading-tight text-gray-700 focus:border-blue-300 focus:bg-white focus:outline-none'
                                id='grid-state'
                                {...register("assignTo")}
                            >
                                {!isUserFetching &&
                                userList?.data &&
                                userList?.data?.result?.length > 0
                                    ? userList?.data?.result.map((item) => {
                                          return (
                                              <option
                                                  value={item.id}
                                                  key={item.id}
                                              >
                                                  {`${item.firstName} ${item.lastName}`}
                                              </option>
                                          );
                                      })
                                    : []}
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
                    </div>
                </div>

                <div className='flex w-full gap-4'>
                    <div className='mb-4 w-1/2'>
                        <label className='mb-2 block text-sm font-bold text-gray-700'>
                            Label
                        </label>
                        <select
                            className='block w-full appearance-none rounded border border-gray-200 bg-white px-4 py-2 pr-8 leading-tight text-gray-700 focus:border-blue-300 focus:bg-white focus:outline-none'
                            id='grid-state'
                            {...register("label")}
                        >
                            {!isLabelFetching &&
                            labelList?.data &&
                            labelList?.data?.result?.length > 0
                                ? labelList?.data.result?.map((item) => {
                                      return (
                                          <option
                                              className='text-capitalize'
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
                    <div className='mb-4 w-1/2'>
                        <label className='mb-2 block text-sm font-bold text-gray-700'>
                            Sprint
                        </label>
                        <select
                            className='block w-full appearance-none rounded border border-gray-200 bg-white px-4 py-2 pr-8 leading-tight text-gray-700 focus:border-blue-300 focus:bg-white focus:outline-none'
                            id='grid-state'
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
            </form>
            <div className='flex items-center justify-end gap-4'>
                <button
                    onClick={onClose}
                    className='focus:shadow-outline rounded bg-gray-100 px-4 py-2 font-bold text-gray-500 hover:text-gray-800'
                >
                    Cancel
                </button>
                <button
                    disabled={isSubmitting}
                    onClick={handleSubmit(onSubmit)}
                    className={` ${
                        isSubmitting ? "opacity-50" : ""
                    } focus:shadow-outline rounded bg-blue-500 px-8 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none`}
                    type='submit'
                >
                    {isSubmitting ? <Spinner /> : "Submit"}
                </button>
            </div>
        </div>
    );
};

export default TaskModal;
