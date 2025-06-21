"use client";

import * as yup from "yup";

import { FolderPen, FolderPlus } from "lucide-react";
import {
  IAddProjectPayload,
  IMultiList,
  IPriorityOptions,
  IProject,
  IProjectStatusOptions,
  IUpdateProjectPayload,
  IUploadFile,
  Priority,
  ProjectStatus,
  priorityOptions,
  projectStatusOptions,
} from "@/types/user.types";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  useCreateProjectMutation,
  useCreateUploadsMutation,
  useGetUsersQuery,
  useLazyGetProjectByIdQuery,
  useUpdateProjectMutation,
} from "@/store/api";

import Dropzone from "../../(components)/Dropzone";
import { Editor } from "@tiptap/react";
import GoBackButton from "@/app/(components)/molecules/BackButton";
import MultiSelect from "../../(components)/atoms/MultiSelect";
import Spinner from "../../(components)/Spinner";
import TextEditor from "../../(components)/TextEditor";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";

interface IFormInput {
  name: string;
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
  const router = useRouter();
  const { onClose, selectedData } = props;
  const { isFetching: isUserFetching, data: userList } = useGetUsersQuery();
  const [files, setFiles] = useState<File[]>([]);
  const [OldFiles, setOldFiles] = useState<IUploadFile[]>([]);
  const [editorContent, setEditorContent] = useState("type here...");
  const [createProjectMutation] = useCreateProjectMutation();
  const [updateProjectMutation] = useUpdateProjectMutation();
  const [fetchProject] = useLazyGetProjectByIdQuery();
  const [createUploadMutation] = useCreateUploadsMutation();
  const [editorInstance, setEditorInstance] = useState<Editor | undefined>();

  useEffect(() => {
    if (editorInstance) {
      editorInstance.commands.setContent(editorContent);
    }
  }, [editorInstance]);

  // const [fetchAllProject] = useLazyGetProjectsQuery();
  const [selectedTeamMember, setSelectedTeamMember] = useState<IMultiList[]>(
    [],
  );
  const schema = yup.object().shape({
    name: yup.string().required("Project name is required"),
    priority: yup.string(),
    startDate: yup.string(),
    endDate: yup.string(),
    admin: yup.number(),
    status: yup.string(),
  });

  const defaultValues: IFormInput = {
    name: "",
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
      fetchProjectResponse,
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
    console.log(files);
    console.log(data);
    console.log(selectedTeamMember);
    // projectId: Number(id),

    const payload: IAddProjectPayload | IUpdateProjectPayload = {
      name: data.name,
      description: editorContent,
      priority: data.priority,
      admin: Number(data.admin),
      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status,
      teamMember: selectedTeamMember.map((item) => item.value),
      projectUploads: [],
    };

    try {
      if (files?.length > 0) {
        const fileResponseList = await Promise.all(
          files.map(async (file: File) => {
            const response = await createUploadMutation({
              files: [file],
            }).unwrap();
            return response;
          }),
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

        const response =
          await updateProjectMutation(updateProjectPayload).unwrap();
        if (response.success) {
          toast.success("Project updated successfully");
          onClose();
        }
      } else {
        const addProjectPayload: IAddProjectPayload = {
          ...payload,
        };
        const response =
          await createProjectMutation(addProjectPayload).unwrap();
        if (response.success) {
          toast.success("Project added successfully");
          router.back();
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong!");
    }
  };

  return (
    <div className="container mx-auto mt-4 px-4 pt-4 shadow-sm lg:px-8 lg:pt-2 xl:max-w-7xl">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          {selectedData?.id ? (
            <FolderPen className="mr-2 h-5 w-5 text-gray-800" />
          ) : (
            <FolderPlus className="mr-2 h-5 w-5 text-gray-800" />
          )}{" "}
          <h3 className="text-xl font-bold text-gray-800">
            {selectedData?.id ? "Edit" : "Add"} new project
          </h3>
        </div>{" "}
        <div className="mt-4 flex items-center justify-end gap-4">
          <GoBackButton />
          <button
            disabled={isSubmitting}
            onClick={handleSubmit(onSubmit)}
            className={` ${isSubmitting ? "opacity-50" : ""} focus:shadow-outline rounded bg-blue-500 px-8 py-1 font-bold text-white hover:bg-blue-700 focus:outline-none`}
          >
            {!!isSubmitting && <Spinner />}
            <span> {selectedData ? "Update" : "Submit"}</span>
          </button>
        </div>
      </div>
      <form className="">
        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-700">
            Project title <span className="text-red-500">*</span>
          </label>
          <input
            className="focus:shadow-outline mb-2 w-full appearance-none rounded border border-gray-200 bg-white px-3 py-2 leading-tight text-gray-800 shadow-sm focus:border-blue-300 focus:outline-none"
            type="text"
            placeholder="title"
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
            Description
          </label>

          <TextEditor
            setEditorInstance={setEditorInstance}
            setEditorContent={setEditorContent}
            editorContent={editorContent}
          />
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-700">
            Attachments
          </label>
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
              Admin
            </label>
            <div className="relative">
              <select
                className="block w-full appearance-none rounded border border-gray-200 bg-white px-4 py-2 pr-8 leading-tight text-gray-700 focus:border-blue-300 focus:bg-white focus:outline-none"
                id="grid-state"
                {...register("admin")}
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
        </div>
        <div className="flex w-full gap-4">
          <div className="mb-4 w-1/2">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Team Member
            </label>
            <div className="relative">
              <MultiSelect
                list={
                  !isUserFetching &&
                  userList?.data &&
                  userList?.data?.length > 0
                    ? userList?.data.map((item) => {
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
          <div className="relative mb-4 w-1/2">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Status
            </label>
            <div className="relative">
              <select
                className="block w-full appearance-none rounded border border-gray-200 bg-white px-4 py-2 pr-8 leading-tight text-gray-700 focus:border-blue-300 focus:bg-white focus:outline-none"
                {...register("status")}
              >
                {projectStatusOptions.map((status: IProjectStatusOptions) => (
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
      </form>
    </div>
  );
};

export default ProjectModal;
