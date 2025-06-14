import {
  IAddProjectPayload,
  ILabelPayload,
  ILabelResponse,
  ILabelUpdatePayload,
  IProject,
  ISprintPayload,
  ISprintResponse,
  ISprintUpdatePayload,
  ITask,
  ITaskPayload,
  IUpdateProjectPayload,
  IUploadFile,
  IUser,
  LabelPagination,
  Pagination,
  Response,
  ResponseWithPagination,
  SprintPagination,
} from "../types/user.types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import dotenv from "dotenv";

dotenv.config();

// /* REDUX API */

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: "api",
  tagTypes: ["Users", "Projects", "Tasks", "Sprints", "Labels"],
  endpoints: (build) => ({
    getUsers: build.query<Response<IUser[]>, void>({
      query: () => ({
        url: "users",
        method: "GET",
      }),
    }),
    createUsers: build.mutation<IUser, Partial<IUser>>({
      query: (payload) => ({
        url: "users",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Users"],
    }),
    getProjects: build.query<ResponseWithPagination<IProject[]>, Pagination>({
      query: ({
        isPaginationEnabled = true,
        page = 1,
        pageSize = 10,
        keyword,
      }) => ({
        url: "projects",
        method: "GET",
        params: {
          isPaginationEnabled,
          page,
          pageSize,
          keyword: keyword ? keyword : undefined,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.result.map((project) => ({
                type: "Projects" as const,
                id: project.id,
              })),
              { type: "Projects" as const, id: "LIST" },
            ]
          : [{ type: "Projects" as const, id: "LIST" }],
    }),
    getProjectById: build.query<Response<IProject>, { projectId: number }>({
      query: ({ projectId }) => ({
        url: `projects/${projectId}?withTask=true`,
        method: "GET",
      }),
    }),
    createProject: build.mutation<Response<IProject>, IAddProjectPayload>({
      query: (payload) => ({
        url: "projects",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "Projects", id: "LIST" }],
    }),
    updateProject: build.mutation<Response<IProject>, IUpdateProjectPayload>({
      query: ({ projectId, ...payload }) => ({
        url: `projects/${projectId}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: [{ type: "Projects", id: "LIST" }],
    }),
    // ! TASKS-STARTS
    getTasks: build.query<ITask[], void>({
      query: () => ({
        url: "projects",
        method: "GET",
      }),
    }),
    getTasksByTaskId: build.query<Response<ITask>, { taskId: number }>({
      query: ({ taskId }) => ({
        url: `tasks/${taskId}`,
        method: "GET",
      }),
    }),
    getTasksByProjectId: build.query<ITask[], { projectId: number }>({
      query: ({ projectId }) => ({
        url: `tasks/projects/${projectId}?withTask=true`,
        method: "GET",
        providesTags: (result: ITask[]) =>
          result
            ? result?.map(({ id }) => ({ type: "Tasks" as const, id }))
            : [
                {
                  type: "Tasks" as const,
                },
              ],
      }),
    }),
    createTasks: build.mutation<Response<ITask>, ITaskPayload>({
      query: (payload) => ({
        url: "tasks",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Tasks"],
    }),
    updateTaskStatus: build.mutation<ITask, Partial<ITask>>({
      query: ({ id, status }) => ({
        url: `tasks/status/${id}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => {
        console.log({
          result,
          error,
          id,
        });
        return [{ type: "Tasks", id }];
      },
    }),
    createUploads: build.mutation<Response<IUploadFile>, { files: File[] }>({
      query: (body) => {
        const formData = new FormData();
        body.files.forEach((file: File) => {
          formData.append("file", file);
        });

        return {
          url: "uploads",
          method: "POST",
          body: formData,
          formData: true,
        };
      },
    }),
    // ! SPRINTS-STARTS
    getSprints: build.query<
      ResponseWithPagination<ISprintResponse[]>,
      SprintPagination
    >({
      query: ({
        isPaginationEnabled = true,
        page = 1,
        pageSize = 10,
        keyword,
        isActive,
      }) => ({
        url: "sprints",
        method: "GET",
        params: {
          isPaginationEnabled,
          page,
          pageSize,
          keyword: keyword ? keyword : undefined,
          isActive,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.result.map((sprint) => ({
                type: "Sprints" as const,
                id: sprint.id,
              })),
              { type: "Sprints" as const, id: "LIST" },
            ]
          : [{ type: "Sprints" as const, id: "LIST" }],
    }),

    getSprintById: build.query<Response<ISprintResponse>, { sprintId: number }>(
      {
        query: ({ sprintId }) => ({
          url: `sprints/${sprintId}`,
          method: "GET",
        }),
      },
    ),

    createSprint: build.mutation<Response<ISprintResponse>, ISprintPayload>({
      query: (payload) => ({
        url: "sprints",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "Sprints", id: "LIST" }],
    }),
    updateSprint: build.mutation<
      Response<ISprintResponse>,
      ISprintUpdatePayload
    >({
      query: ({ id, ...payload }) => ({
        url: `sprints/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Sprints", id: id },
        { type: "Sprints", id: "LIST" },
      ],
    }),

    updateSprintStatus: build.mutation<
      Response<ISprintResponse>,
      { sprintId: number; isActive: boolean }
    >({
      query: ({ sprintId, isActive }) => ({
        url: `sprints/${sprintId}/status`,
        method: "PUT",
        body: { isActive },
      }),
      invalidatesTags: (result, error, { sprintId }) => [
        { type: "Sprints", id: sprintId },
        { type: "Sprints", id: "LIST" },
      ],
    }),
    // ! SPRINTS-ENDS
    getLabels: build.query<
      ResponseWithPagination<ILabelResponse[]>,
      LabelPagination
    >({
      query: ({
        isPaginationEnabled = true,
        page = 1,
        pageSize = 10,
        keyword,
        isActive,
      }) => ({
        url: "labels",
        method: "GET",
        params: {
          isPaginationEnabled,
          page,
          pageSize,
          keyword: keyword ? keyword : undefined,
          isActive,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.result.map((label) => ({
                type: "Labels" as const,
                id: label.id,
              })),
              { type: "Labels" as const, id: "LIST" },
            ]
          : [{ type: "Labels" as const, id: "LIST" }],
    }),

    getLabelById: build.query<Response<ILabelResponse>, { labelId: number }>({
      query: ({ labelId }) => ({
        url: `labels/${labelId}`,
        method: "GET",
      }),
    }),

    createLabel: build.mutation<Response<ILabelResponse>, ILabelPayload>({
      query: (payload) => ({
        url: "labels",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "Labels", id: "LIST" }],
    }),

    updateLabel: build.mutation<Response<ILabelResponse>, ILabelUpdatePayload>({
      query: ({ id, ...payload }) => ({
        url: `labels/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Labels", id },
        { type: "Labels", id: "LIST" },
      ],
    }),

    updateLabelStatus: build.mutation<
      Response<ILabelResponse>,
      { labelId: number; isActive: boolean }
    >({
      query: ({ labelId, isActive }) => ({
        url: `labels/${labelId}/status`,
        method: "PUT",
        body: { isActive },
      }),
      invalidatesTags: (result, error, { labelId }) => [
        { type: "Labels", id: labelId },
        { type: "Labels", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useCreateUsersMutation,
  useGetProjectByIdQuery,
  //TASKS
  useUpdateTaskStatusMutation,
  useLazyGetProjectByIdQuery,
  useCreateTasksMutation,
  useCreateProjectMutation,
  useLazyGetProjectsQuery,
  useGetProjectsQuery,
  useCreateUploadsMutation,
  useLazyGetTasksByTaskIdQuery,
  // SPRINTS
  useUpdateProjectMutation,
  useGetSprintsQuery,
  useCreateSprintMutation,
  useGetSprintByIdQuery,
  useUpdateSprintStatusMutation,
  useUpdateSprintMutation,
  //LABEL
  useGetLabelsQuery,
  useCreateLabelMutation,
  useUpdateLabelMutation,
  useUpdateLabelStatusMutation,
  useLazyGetLabelsQuery,
} = api;
