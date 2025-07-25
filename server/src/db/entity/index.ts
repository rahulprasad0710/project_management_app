import { Activity } from "./activity";
import { BaseEntityWithAudit } from "./Audit";
import { Comment } from "./comment";
import { Department } from "./department";
import { Label } from "./taskLabel";
import { Notification } from "./Notification";
import { Permission } from "./Permission";
import { Project } from "./project";
import { ProjectTaskStatus } from "./ProjectTaskStatus";
import { Role } from "./role";
import { Sprint } from "./sprint";
import { Task } from "./task";
import { TaskStatus } from "./taskStatus";
import { UploadFile } from "./uploads";
import { User } from "./User";

export default [
    User,
    Project,
    Task,
    UploadFile,
    Label,
    Sprint,
    Comment,
    Activity,
    Notification,
    Department,
    Role,
    Permission,
    BaseEntityWithAudit,
    TaskStatus,
    ProjectTaskStatus,
];
