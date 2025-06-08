import UploadService, { IUploadFileURL } from "./upload.service";

import { IPagination } from "../types/express";
import { IProject } from "../types/payload";
import { Project } from "../db/entity/project";
import { Task } from "../db/entity/task";
import { UploadFile } from "../db/entity/uploads";
import { User } from "../db/entity/User";
import createPagination from "../utils/createPagination";
import dataSource from "../db/data-source";

const uploadService = new UploadService();
export class ProjectService {
    constructor(
        private readonly projectRepository = dataSource.getRepository(Project),
        private readonly taskRepository = dataSource.getRepository(Task),
        private readonly userRepository = dataSource.getRepository(User),
        private readonly uploadRepository = dataSource.getRepository(UploadFile)
    ) {}

    async create(project: IProject) {
        console.log({
            project,
        });
        const projectObj = new Project();
        projectObj.name = project.name;
        projectObj.description = project.description;
        projectObj.startDate = project.startDate;
        projectObj.endDate = project.endDate;
        projectObj.admin = project.admin;
        projectObj.status = project.status;
        projectObj.priority = project.priority;

        if (project?.profilePicture) {
            projectObj.profilePicture = project?.profilePicture ?? "";
        }
        const newProjectResult = await this.projectRepository.save(projectObj);

        for (let index = 0; index < project.teamMember.length; index++) {
            const element = project.teamMember[index];
            await this.addTeamMember(newProjectResult.id, element);
        }

        for (let index = 0; index < project.projectUploads.length; index++) {
            const element = project.projectUploads[index];
            await this.addProjectAttachments(newProjectResult.id, element);
        }

        return newProjectResult;
    }

    async getAll(query: IPagination) {
        const { skip, take, isPaginationEnabled } = query;
        console.log({
            skip,
            take,
        });
        const result = await this.projectRepository.find({
            select: [
                "id",
                "name",
                "startDate",
                "endDate",
                "status",
                "priority",
                "description",
                "profilePicture",
                "admin",
            ],
            skip: skip,
            take: take,
        });
        const totalCount = await this.projectRepository.count();
        return {
            result,
            pagination: createPagination(
                skip,
                take,
                totalCount,
                isPaginationEnabled
            ),
        };
    }

    async update(id: number, project: IProject) {
        const projectObj = new Project();
        projectObj.name = project.name;
        projectObj.description = project.description;
        projectObj.startDate = project.startDate;
        projectObj.endDate = project.endDate;
        projectObj.admin = project.admin;

        return await this.projectRepository.update(id, projectObj);
    }

    async delete(id: number) {
        return await this.projectRepository.delete(id);
    }

    async addTeamMember(projectId: number, userId: number) {
        const project = await this.projectRepository.findOne({
            where: { id: projectId },
            relations: ["teamMember"],
        });
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });

        if (project !== null && user !== null) {
            project?.teamMember.push(user);
            const response = await this.projectRepository.save(project);
            if (response) {
                return response;
            }
        }
    }

    async addProjectAttachments(projectId: number, uploadId: string) {
        console.log({
            projectId,
            uploadId,
        });
        const project = await this.projectRepository.findOne({
            where: { id: projectId },
            relations: ["teamMember"],
        });
        const uploadResponse = await this.uploadRepository.findOne({
            where: { id: uploadId },
        });
        console.log(
            "LOG: ~ ProjectService ~ addProjectAttachments ~ uploadResponse:",
            uploadResponse
        );

        if (project == null || uploadResponse == null) {
            throw new Error("Attachment Error");
        } else {
            project?.projectUploads.push(uploadResponse);
            const response = await this.projectRepository.save(project);
            if (response) {
                return response;
            }
        }
    }

    async getById(id: number, withTask: boolean) {
        const response = await this.projectRepository.findOne({
            where: { id },
            relations: ["admin", "teamMember", "projectUploads"],
        });

        let tasks: Task[] = [];
        if (withTask) {
            tasks = await this.taskRepository.find({
                where: { project: { id } },
            });
        }

        let projectUploads: IUploadFileURL[] = [];

        console.log({
            response: response?.projectUploads,
        });

        if (response?.projectUploads && response?.projectUploads?.length > 0) {
            projectUploads = await uploadService.getUrlList(
                response?.projectUploads
            );
        }

        return {
            ...response,
            projectUploads,
            tasks,
        };
    }
}

export default ProjectService;
