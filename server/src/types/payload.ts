import { Priority, ProjectStatus, TaskStatus } from "../enums/Priority";

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
    status: TaskStatus;
    priority: Priority;
    taskLabel?: Label;
    taskUploads: string[];
}

export interface IUpdateTaskPayload extends ITask {
    updatedTaskUploads: string[];
}
