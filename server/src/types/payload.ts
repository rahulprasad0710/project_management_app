import { Priority, ProjectStatus, TaskStatusEnum } from "../enums/Priority";

import { IPagination } from "./express";
import { Label } from "../db/entity/taskLabel";
import { Project } from "./../db/entity/project";
import { User } from "../db/entity/User";

export interface IProject {
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    admin: User;
    teamMember: number[];
    status: ProjectStatus;
    priority: Priority;
    projectUploads: string[];
    profilePicture?: string;
}

export interface IUpdateProjectPayload extends IProject {
    updatedProjectUploads: string[];
}

export interface ITask {
    title: string;
    description: string;
    addedDate: Date;
    addedBy: User;
    assignedTo: User;
    assignedBy: User;
    project: Project;
    status: TaskStatusEnum;
    priority: Priority;
    taskLabel?: Label;
    taskUploads: string[];
}

export interface IUpdateTaskPayload extends ITask {
    updatedTaskUploads: string[];
}

export interface IProjectPagination extends IPagination {
    status?: ProjectStatus[] | undefined;
    priority?: Priority[] | undefined;
}

export interface IEmployeePagination extends IPagination {
    isActive?: boolean | undefined;
}

export interface ITaskPagination extends IPagination {
    priority?: string[] | undefined;
    labels?: number[] | undefined;
    assignedTo?: number[] | undefined;
    projectId?: number | undefined;
    featureId?: number | undefined;
}

export interface IActivePagination extends IPagination {
    isActive?: boolean | undefined;
}
