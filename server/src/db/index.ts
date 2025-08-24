import {
    BookingLogs,
    BookingServiceFailures,
} from "./entity/hotel/BookingServiceFailure";

import { Activity } from "./entity/activity";
import { AdminAudit } from "./entity/AdminAudit";
import { BaseEntityWithAudit } from "./entity/Audit";
// Hotel Entity
import { Booking } from "./entity/hotel/Booking";
import { BookingRoom } from "./entity/hotel/BookingRoom";
import { Comment } from "./entity/comment";
import { Customer } from "./entity/Customer";
import { Department } from "./entity/department";
import { Feature } from "./entity/Feature";
import { FeatureTaskStatus } from "./entity/FeatureTaskStatus";
import { FeatureUpload } from "./entity/FeatureUpload";
import { InternalCompany } from "./entity/InternalCompany";
import { Label } from "./entity/taskLabel";
import { Notification } from "./entity/Notification";
import { Permission } from "./entity/Permission";
import { PermissionGroup } from "./entity/PermissionGroup";
import { Project } from "./entity/project";
import { ProjectTaskStatus } from "./entity/ProjectTaskStatus";
import { Role } from "./entity/role";
import { Room } from "./entity/hotel/Room";
import { RoomType } from "./entity/hotel/RoomType";
import { Sprint } from "./entity/sprint";
import { Task } from "./entity/task";
import { TaskStatus } from "./entity/taskStatus";
import { UploadFile } from "./entity/uploads";
import { User } from "./entity/User";
// View Entity
import { UserView } from "./view/UserView";

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
    FeatureTaskStatus,
    Customer,
    // Views
    UserView,
    // View_End
    // Hotel
    Booking,
    BookingRoom,
    Room,
    RoomType,
    BookingServiceFailures,
    BookingLogs,
];
