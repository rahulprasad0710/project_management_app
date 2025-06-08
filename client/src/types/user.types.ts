export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  cognitoId: string;
}

export interface IProject {
  id: number;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  admin: IUser | number;
  teamMembers: IUser[];
  tasks: ITask[];
  status: ProjectStatus;
  priority: Priority;
}

export interface ITask {
  id: number;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  addedBy: IUser;
  assignedTo: IUser;
  projectId: IProject;
  status: TaskStatus;
  priority: Priority;
}

export interface ITaskPayload {
  title: string;
  description: string;
  priority: Priority;
  assignTo: number;
  startDate: Date;
  endDate: Date;
  addedBy: number;
  status: TaskStatus;
  projectId: number;
}

export interface IAddProjectPayload {
  name: string;
  description: string;
  priority: Priority;
  admin: number;
  startDate: Date;
  endDate: Date;
  team_member: number[];
  status: ProjectStatus;
  projectId: number;
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
}
