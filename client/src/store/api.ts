import {
  IAddProjectPayload,
  IProject,
  ITask,
  ITaskPayload,
  IUpdateProjectPayload,
  IUploadFile,
  IUser,
} from "../types/user.types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import dotenv from "dotenv";

dotenv.config();

export interface Response<T> {
  message: string;
  success: boolean;
  data: T;
}

export interface ResponseWithPagination<T> {
  message: string;
  success: boolean;
  data: {
    result: T;
    pagination: {
      currentPage: number;
      pageSize: number;
      totalCount: number;
      totalPages: number;
    };
  };
}

export interface Pagination {
  page: number;
  pageSize: number;
  isPaginationEnabled: boolean;
  keyword?: string;
}

// /* REDUX API */

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: "api",
  tagTypes: ["Users", "Projects", "Tasks"],
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
        url: `projects/${projectId}`,
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
    getTasks: build.query<ITask[], void>({
      query: () => ({
        url: "projects",
        method: "GET",
      }),
    }),
    getTasksByProjectId: build.query<ITask[], { projectId: number }>({
      query: ({ projectId }) => ({
        url: `tasks/projects/${projectId}`,
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
    createTasks: build.mutation<ITask, ITaskPayload>({
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
  }),
});

export const {
  useGetUsersQuery,
  useCreateUsersMutation,
  useGetProjectByIdQuery,
  useUpdateTaskStatusMutation,
  useLazyGetProjectByIdQuery,
  useCreateTasksMutation,
  useCreateProjectMutation,
  useLazyGetProjectsQuery,
  useGetProjectsQuery,
  useCreateUploadsMutation,
  useUpdateProjectMutation,
} = api;
