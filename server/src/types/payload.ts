import { Priority, ProjectStatus } from "../enums/Priority";

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
