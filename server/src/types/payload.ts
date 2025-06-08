import { Priority, ProjectStatus } from "../enums/Priority";

import { Project } from "../db/entity/project";
import { Task } from "../db/entity/task";
import { UploadFile } from "../db/entity/uploads";
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
    projectUploads: UploadFile[];
    profilePicture?: string;
}
