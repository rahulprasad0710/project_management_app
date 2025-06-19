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

export interface IProjectPagination extends Pagination {
  status?: ProjectStatus[] | undefined;
  priority?: Priority | undefined;
}

export interface SprintPagination extends Pagination {
  isActive: boolean;
}

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  cognitoId: string;
  profilePictureUrl: string | null;
}

export interface IProject {
  id: number;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  admin: IUser;
  teamMember: IUser[];
  tasks: ITask[];
  status: ProjectStatus;
  priority: Priority;
  projectUploads: IUploadFile[];
}

export interface ITask {
  id: number;
  title: string;
  description: string;
  addedDate: Date;
  addedBy: IUser;
  assignedTo: IUser;
  projectId: IProject;
  status: TaskStatus;
  taskLabel: ILabelResponse;
  sprint: ISprintResponse;
  taskNumber: string;
  priority: Priority;
  taskUploads: IUploadFile[];
}

export interface ITaskPayload {
  title: string;
  description: string;
  priority: Priority;
  assignTo: number;
  assignedBy: number;
  addedBy: number;
  addedDate: Date;
  status: TaskStatus;
  project: number;
  taskLabel?: number;
  taskUploads: string[];
}

export interface IAddProjectPayload {
  name: string;
  description: string;
  priority: Priority;
  admin: number;
  startDate: string;
  endDate: string;
  teamMember: number[];
  status: ProjectStatus;
  projectUploads: string[];
}
export interface IUpdateProjectPayload extends IAddProjectPayload {
  projectId: number;
  updatedProjectUploads: string[];
}

export interface IFileUploadsPayload {
  formData: FormData;
}

export interface IUploadFile {
  id: string;
  filename: string;
  originalname: string;
  size: number;
  extension: string;
  mimetype?: string;
  fileType?: string;
  cloudPath?: string;
  cloudId?: string;
  cloudUrl?: string;
  createdBy: IUser; // Or use a custom IUser interface if you have one
  createdAt: Date;
  updatedAt: Date;
  backendUrl: string;
}

export type TaskStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "FOR_FIX"
  | "UNDER_REVIEW";

export type ProjectStatus =
  | "TODO"
  | "STARTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "UNDER_REVIEW";

export type Priority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | "BACKLOG";

export interface IPriorityOptions {
  value: Priority;
  label: string;
}
export const priorityOptions: IPriorityOptions[] = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "CRITICAL", label: "Critical" },
  { value: "BACKLOG", label: "Backlog" },
];

export interface IStatusOptions {
  value: TaskStatus;
  label: string;
}

export interface IProjectStatusOptions {
  value: ProjectStatus;
  label: string;
}

export const statusOptions: IStatusOptions[] = [
  { value: "TODO", label: "To Do" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "FOR_FIX", label: "For Fix" },
  { value: "UNDER_REVIEW", label: "Under Review" },
  { value: "COMPLETED", label: "Completed" },
];

export const projectStatusOptions: IProjectStatusOptions[] = [
  { value: "STARTED", label: "Start" },
  { value: "TODO", label: "To Do" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "UNDER_REVIEW", label: "Under Review" },
  { value: "COMPLETED", label: "Completed" },
];

export interface ISprintPayload {
  name: string;
  goal?: string;
  startDate: string;
  endDate: string;
}

export interface ISprintResponse extends ISprintPayload {
  id: number;
  addedBy: number | IUser;
  isActive: boolean;
}

export interface ISprintUpdatePayload extends ISprintPayload {
  id: number;
}

export interface ILabelPayload {
  name: string;
  description?: string;
  addedBy: number; // or User if populated
}

export interface ILabelUpdatePayload extends Partial<ILabelPayload> {
  id: number;
}

export interface ILabelResponse {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  addedAt: string;
  addedBy: IUser | number;
  colorCode: string;
}

export interface LabelPagination {
  isPaginationEnabled?: boolean;
  page?: number;
  pageSize?: number;
  keyword?: string;
  isActive?: boolean;
}

// types.ts

export interface IComment {
  id: number;
  content: string;
  isActive: boolean;
  addedAt: string;
  addedBy: IUser;
  task: number;
}

export interface ICommentPayload {
  content: string;
  task: number;
  addedBy: number;
}

export interface ICommentUpdatePayload {
  content: string;
}

export interface Response<T> {
  success: boolean;
  data: T;
  message: string;
}

export enum ActivityAction {
  CREATED_TICKET = "CREATED_TICKET",
  ASSIGNED_TICKET = "ASSIGNED_TICKET",
  MOVED_TICKET = "MOVED_TICKET",
  UPDATED_TICKET = "UPDATED_TICKET",
  COMMENTED_TICKET = "COMMENTED_TICKET",
  DELETED_COMMENT = "DELETED_COMMENT",
  EDITED_COMMENT = "EDITED_COMMENT",
}

export type IActivityResponse = {
  id: number;
  action: ActivityAction;
  details?: string;
  comment?: string;
  createdAt: Date;
  activityBy: IUser;
  task: {
    id: number;
    projectId: number;
    taskNumber: string;
    title: string;
    assignedTo: IUser;
  };
};

export type IMultiList = {
  label: string;
  value: number | string;
  icon?: string | React.ReactNode;
};
