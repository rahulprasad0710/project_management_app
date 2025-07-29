import { Activity } from "./activity";
import { AdminAudit } from "./AdminAudit";
import { BaseEntityWithAudit } from "./Audit";
import { Comment } from "./comment";
import { Department } from "./department";
import { Feature } from "./Feature";
import { FeatureUpload } from "./FeatureUpload";
import { InternalCompany } from "./InternalCompany";
import { Label } from "./taskLabel";
import { Notification } from "./Notification";
import { Permission } from "./Permission";
import { PermissionGroup } from "./PermissionGroup";
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
    PermissionGroup,
    Permission,
    BaseEntityWithAudit,
    TaskStatus,
    ProjectTaskStatus,
    InternalCompany,
    Feature,
    FeatureUpload,
    AdminAudit,
];
