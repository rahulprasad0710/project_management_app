import * as yup from "yup";

import type {
    IAddProjectPayload,
    IMultiList,
    IPriorityOptions,
    IProject,
    IUpdateProjectPayload,
    IUploadFile,
    Priority,
    ProjectStatus,
} from "@/types/config.types";
import {
    useCreateProjectMutation,
    useCreateUploadsMutation,
    useLazyGetProjectByIdQuery,
    useUpdateProjectMutation,
} from "@apiHooks/useProject";
import { useEffect, useState } from "react";

import Button from "@/components/ui/button/Button";
import Dropzone from "@components/common/Dropzone";
import { Edit } from "lucide-react";
import { Editor } from "@tiptap/react";
import MultiSelect from "@components/atoms/MultiSelect";
import { Spinner } from "@components/atoms/Spinner";
import type { SubmitHandler } from "react-hook-form";
import TextEditor from "@components/common/TextEditor";
import { priorityOptions } from "@/types/config.types";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useGetEmployeesQuery } from "@apiHooks/useEmployee";
import { yupResolver } from "@hookform/resolvers/yup";

interface IFormInput {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    admin: number;
    priority: Priority;
    status: ProjectStatus;
}

type Props = {
    onClose: () => void;
    selectedData: undefined | IProject;
    setSelectedData: (data: IProject | undefined) => void;
};

const ProjectModal = (props: Props) => {
    const { onClose, selectedData } = props;
    const { isFetching: isUserFetching, data: userList } = useGetEmployeesQuery(
        {
            isPaginationEnabled: false,
            page: 1,
            pageSize: 10,
            keyword: "",
            isActive: true,
        }
    );
    const [files, setFiles] = useState<File[]>([]);
    const [OldFiles, setOldFiles] = useState<IUploadFile[]>([]);
    const [editorContent, setEditorContent] = useState("type here...");
    const [createProjectMutation] = useCreateProjectMutation();
    const [updateProjectMutation] = useUpdateProjectMutation();
    const [fetchProject] = useLazyGetProjectByIdQuery();
    const [createUploadMutation] = useCreateUploadsMutation();
    const [editorInstance, setEditorInstance] = useState<Editor | undefined>();

    // const [fetchAllProject] = useLazyGetProjectsQuery();
    const [selectedTeamMember, setSelectedTeamMember] = useState<IMultiList[]>(
        []
    );
    const schema = yup.object().shape({
        name: yup.string().required("Project name is required"),
        description: yup.string().optional(),
        priority: yup.string().optional(),
        startDate: yup.string().optional(),
        endDate: yup.string().optional(),
        admin: yup.number().optional(),
        status: yup.string().optional(),
    });

    const defaultValues: IFormInput = {
        name: "",
        description: "",
        priority: "MEDIUM",
        admin: 1,
        status: "STARTED",
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

    const populateEditData = async () => {
        const fetchProjectResponse = await fetchProject({
            projectId: selectedData?.id || 0,
        }).unwrap();
        const { data } = fetchProjectResponse;
        console.log(
            "LOG: ~ populateEditData ~ fetchProjectResponse:",
            fetchProjectResponse
        );

        if (data.teamMember?.length > 0) {
            const temp = data.teamMember.map((item) => {
                return {
                    value: item.id,
                    label: item.firstName,
                };
            });

            setSelectedTeamMember(temp);
        }

        if (data.projectUploads?.length > 0) {
            setOldFiles(data.projectUploads);
        }

        reset({
            name: data.name,
            priority: data.priority,
            description: data.description,
            startDate: new Date(data.startDate).toISOString().split("T")[0],
            endDate: new Date(data.endDate).toISOString().split("T")[0],
            status: data.status,
            admin: data.admin.id,
        });
    };

    useEffect(() => {
        if (selectedData) {
            populateEditData();
        }
    }, [selectedData]);

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        try {
            console.log(files);
            console.log(data);
            console.log(selectedTeamMember);
            // projectId: Number(id),

            const payload: IAddProjectPayload | IUpdateProjectPayload = {
                name: data.name,
                description: data.description,
                priority: data.priority,
                admin: Number(data.admin),
                startDate: data.startDate,
                endDate: data.endDate,
                status: data.status,
                teamMember: selectedTeamMember.map((item) =>
                    Number(item.value)
                ),
                projectUploads: [],
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

                payload.projectUploads = fileResponseList.map((items) => {
                    return items.data.id;
                });
            }

            if (selectedData?.id) {
                const updateProjectPayload: IUpdateProjectPayload = {
                    ...payload,
                    projectId: selectedData.id,
                    updatedProjectUploads: OldFiles.map((items) => {
                        return items.id;
                    }),
                };

                const response = await updateProjectMutation(
                    updateProjectPayload
                ).unwrap();
                if (response.success) {
                    toast.success("Project updated successfully");
                    onClose();
                }
            } else {
                const addProjectPayload: IAddProjectPayload = {
                    ...payload,
                };
                const response = await createProjectMutation(
                    addProjectPayload
                ).unwrap();
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
        <div className='relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-6'>
            <div className='px-2 pr-14'>
                <h4 className='mb-2 text-xl font-semibold text-gray-800 dark:text-white/90'>
                    Add Project
                </h4>
            </div>
            <form
                className='max-h-[700px] overflow-y-auto bg-white p-6 dark:bg-slate-800'
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className='mb-4'>
                    <label className='mb-2 block text-sm font-bold text-gray-700'>
                        Project title
                    </label>
                    <input
                        className='focus:shadow-outline mb-2 w-full appearance-none rounded border border-gray-200 bg-white px-3 py-2 leading-tight text-gray-800 shadow-sm focus:border-blue-300 focus:outline-none'
                        type='text'
                        placeholder='title'
                        {...register("name", { required: true })}
                    />
                    {errors.name && (
                        <p className='text-xs italic text-red-500'>
                            {errors.name?.message}
                        </p>
                    )}
                </div>
                <div className='mb-4'>
                    <label className='mb-2 block text-sm font-bold text-gray-700'>
                        Description
                    </label>

                    <TextEditor
                        setEditorInstance={setEditorInstance}
                        setEditorContent={setEditorContent}
                        editorContent={editorContent}
                    />
                </div>
                <div className='mb-4'>
                    <label className='mb-2 block text-sm font-bold text-gray-700'>
                        Attachments
                    </label>
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
                            Admin
                        </label>
                        <div className='relative'>
                            <select
                                className='block w-full appearance-none rounded border border-gray-200 bg-white px-4 py-2 pr-8 leading-tight text-gray-700 focus:border-blue-300 focus:bg-white focus:outline-none'
                                id='grid-state'
                                {...register("admin")}
                            >
                                {!isUserFetching &&
                                userList?.data &&
                                userList?.data?.result?.length > 0
                                    ? userList?.data?.result?.map((item) => {
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
                </div>

                <div className='mb-4 w-full'>
                    <label className='mb-2 block text-sm font-bold text-gray-700'>
                        Team Member
                    </label>
                    <div className='relative'>
                        <MultiSelect
                            list={
                                !isUserFetching &&
                                userList?.data &&
                                userList?.data?.result.length > 0
                                    ? userList?.data?.result.map((item) => {
                                          return {
                                              label: `${item.firstName} ${item.lastName}`,
                                              value: item.id,
                                              icon: item.profilePictureUrl as string,
                                          };
                                      })
                                    : []
                            }
                            selectedList={selectedTeamMember}
                            setSelectList={setSelectedTeamMember}
                        />
                    </div>
                </div>
                <div className='flex w-full gap-4'>
                    <div className='mb-4 w-1/2'>
                        <label className='mb-2 block text-sm font-bold text-gray-700'>
                            Start Date
                        </label>
                        <input
                            className='focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow-sm focus:border-blue-300 focus:outline-none'
                            type='date'
                            defaultValue={
                                new Date().toISOString().split("T")[0]
                            }
                            {...register("startDate")}
                        />
                    </div>
                    <div className='mb-4 w-1/2'>
                        <label className='mb-2 block text-sm font-bold text-gray-700'>
                            End Date
                        </label>
                        <input
                            className='focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow-sm focus:border-blue-300 focus:outline-none'
                            type='date'
                            defaultValue={
                                new Date().toISOString().split("T")[0]
                            }
                            {...register("endDate")}
                        />
                    </div>
                </div>
            </form>
            <div className='mt-4 flex items-center justify-end gap-4'>
                <Button size='sm' variant='outline' onClick={onClose}>
                    Cancel
                </Button>

                <button
                    type='button'
                    className='inline-flex items-center justify-center gap-2 rounded-md transition
                                px-4 py-2 text-sm
                                bg-white text-brand-700 ring-1 ring-inset ring-brand-400
                                hover:bg-brand-50
                                dark:bg-gray-900 dark:text-gray-300 dark:ring-gray-600 dark:hover:bg-gray-800'
                >
                    <Edit size={16} />
                    Secondary
                </button>
                <Button
                    size='sm'
                    disabled={isSubmitting}
                    variant='primary'
                    type='button'
                >
                    {!!isSubmitting && <Spinner />}
                    <span> {selectedData ? "Update" : "Submit"}</span>
                </Button>
            </div>
        </div>
    );
};

export default ProjectModal;
