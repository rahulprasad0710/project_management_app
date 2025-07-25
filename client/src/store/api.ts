import {
  EmployeePagination,
  IActivityResponse,
  IAddProjectPayload,
  IComment,
  ICommentPayload,
  ICommentUpdatePayload,
  IEmployeePayload,
  IEmployeeResponse,
  ILabelPayload,
  ILabelResponse,
  ILabelUpdatePayload,
  IProject,
  IProjectPagination,
  IProjectTaskPagination,
  ISprintPayload,
  ISprintResponse,
  ISprintUpdatePayload,
  ITask,
  ITaskPayload,
  IUpdateProjectPayload,
  IUploadFile,
  IUser,
  IVerifyPayload,
  LabelPagination,
  Response,
  ResponseWithPagination,
  SprintPagination,
} from "../types/user.types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import dotenv from "dotenv";
import { getSession } from "next-auth/react";

dotenv.config();

// /* REDUX API */

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      const session = await getSession();
      console.log("LOG: ~ prepareHeaders: ~ session:", session);
      if (session?.accessToken) {
        headers.set("Authorization", `Bearer ${session.accessToken}`);
        headers.set("x-provider", session.provider);
      }
      return headers;
    },
  }),
  reducerPath: "api",
  tagTypes: [
    "Users",
    "Projects",
    "Tasks",
    "Sprints",
    "Labels",
    "Comments",
    "Activity",
    "ProjectTasks",
    "Employees",
  ],
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
    getProjects: build.query<
      ResponseWithPagination<IProject[]>,
      IProjectPagination
    >({
      query: ({
        isPaginationEnabled = true,
        page = 1,
        pageSize = 10,
        keyword,
        status,
        priority,
      }) => ({
        url: "projects",
        method: "GET",
        params: {
          isPaginationEnabled,
          page,
          pageSize,
          keyword: keyword ? keyword : undefined,
          status,
          priority,
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
    getProjectTaskByProjectId: build.query<
      ResponseWithPagination<ITask[]>,
      IProjectTaskPagination
    >({
      query: ({
        isPaginationEnabled = false,
        page = 1,
        pageSize = 10,
        keyword,
        labels,
        priority,
        projectId,
        assignedTo,
      }) => ({
        url: `projects/tasks/${projectId}`,
        method: "GET",
        params: {
          isPaginationEnabled,
          page,
          pageSize,
          keyword: keyword ? keyword : undefined,
          labels,
          priority,
          assignedTo,
        },
      }),
      providesTags: (result) =>
        result?.data
          ? result.data.result?.map(({ id }) => ({
              type: "ProjectTasks" as const,
              id,
            }))
          : [{ type: "ProjectTasks" as const }],
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
    updateTaskStatus: build.mutation<Response<ITask>, Partial<ITask>>({
      query: ({ id, status }) => ({
        url: `tasks/status/${id}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: [{ type: "ProjectTasks", id: "LIST" }],
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

    // ! LABELS-ENDS
    // --------------------------
    // ! COMMENTS-STARTS

    getCommentsByTaskId: build.query<Response<IComment[]>, { taskId: number }>({
      query: ({ taskId }) => ({
        url: `tasks/${taskId}/comments`,
        method: "GET",
      }),
      providesTags: (result, error, taskId) =>
        result
          ? [
              ...result.data.map((comment) => ({
                type: "Comments" as const,
                id: comment.id,
              })),
              { type: "Comments" as const, id: `TASK_${taskId}` },
            ]
          : [{ type: "Comments", id: `TASK_${taskId}` }],
    }),
    // 2. Add comment
    createComment: build.mutation<Response<IComment>, ICommentPayload>({
      query: ({ task, ...payload }) => ({
        url: `tasks/${task}/comments`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (result, error, { task }) => [
        { type: "Comments", id: `TASK_${task}` },
      ],
    }),

    // 3. Update comment
    updateComment: build.mutation<
      Response<IComment>,
      ICommentUpdatePayload & { id: number }
    >({
      query: ({ id, ...payload }) => ({
        url: `comments/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Comments", id }],
    }),

    // 4. Soft delete comment
    deleteComment: build.mutation<Response<IComment>, { commentId: number }>({
      query: ({ commentId }) => ({
        url: `comments/${commentId}`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, commentId) => [
        { type: "Comments", commentId },
      ],
    }),
    // Task Activity
    getActivityByTaskId: build.query<
      Response<IActivityResponse[]>,
      { taskId: number }
    >({
      query: ({ taskId }) => ({
        url: `tasks/${taskId}/activities`,
        method: "GET",
      }),
      providesTags: (result, error, taskId) =>
        result
          ? [
              ...result.data.map((activity) => ({
                type: "Activity" as const,
                id: activity.id,
              })),
              { type: "Activity" as const, id: `TASK_${taskId}` },
            ]
          : [{ type: "Activity", id: `TASK_${taskId}` }],
    }),

    // ! EMPLOYEES-STARTS
    getEmployees: build.query<
      ResponseWithPagination<IEmployeeResponse[]>,
      EmployeePagination
    >({
      query: ({
        isPaginationEnabled = true,
        page = 1,
        pageSize = 10,
        keyword,
        isActive,
      }) => ({
        url: "users",
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
              ...result.data.result.map((employee) => ({
                type: "Employees" as const,
                id: employee.id,
              })),
              { type: "Employees" as const, id: "LIST" },
            ]
          : [{ type: "Employees" as const, id: "LIST" }],
    }),

    getEmployeeById: build.query<
      Response<IEmployeeResponse>,
      { employeeId: number }
    >({
      query: ({ employeeId }) => ({
        url: `users/${employeeId}`,
        method: "GET",
      }),
    }),

    createEmployee: build.mutation<
      Response<IEmployeeResponse>,
      IEmployeePayload
    >({
      query: (payload) => ({
        url: "users",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "Employees", id: "LIST" }],
    }),
    createVerifyEmail: build.mutation<
      Response<IEmployeeResponse>,
      IVerifyPayload
    >({
      query: (payload) => ({
        url: "auth/verify-email",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useCreateUsersMutation,
  // PROJECTS
  useGetProjectTaskByProjectIdQuery,
  useLazyGetProjectTaskByProjectIdQuery,

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
  // COMMENTS
  useLazyGetCommentsByTaskIdQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  // ACTIVITY
  useLazyGetActivityByTaskIdQuery,
  // EMPLOYEES
  useGetEmployeesQuery,
  useCreateEmployeeMutation,
  useGetEmployeeByIdQuery,
  useLazyGetEmployeesQuery,
  //AUTH
  useCreateVerifyEmailMutation,
} = api;
