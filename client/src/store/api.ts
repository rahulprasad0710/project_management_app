import { IProject, ITask, ITaskPayload, IUser } from "../types/user.types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import dotenv from "dotenv";

export interface Response<T> {
  message: string;
  success: boolean;
  data: T;
}

dotenv.config();

// /* REDUX API */

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: "api",
  tagTypes: ["Users", "Projects", "Tasks"],
  endpoints: (build) => ({
    getUsers: build.query<IUser[], void>({
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
    getProjects: build.query<Response<IProject[]>, void>({
      query: () => ({
        url: "projects",
        method: "GET",
      }),
    }),
    getProjectById: build.query<Response<IProject>, { projectId: number }>({
      query: ({ projectId }) => ({
        url: `projects/${projectId}`,
        method: "GET",
      }),
    }),
    createProject: build.mutation<IProject, Partial<IProject>>({
      query: (payload) => ({
        url: "projects",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Projects"],
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
} = api;
