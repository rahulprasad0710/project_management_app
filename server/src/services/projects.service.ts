import { Project } from "../db/entity/project";
import { User } from "../db/entity/User";
import dataSource from "../db/data-source";
import { Task } from "../db/entity/task";
import { IPagination } from "../types/express";
import { Priority, ProjectStatus } from "../enums/Priority";

interface IProject {
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    admin: User;
    team_member: number[];
    status: ProjectStatus;
    priority: Priority;
}

export class ProjectService {
    constructor(
        private readonly projectRepository = dataSource.getRepository(Project),
        private readonly taskRepository = dataSource.getRepository(Task)
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

        const newProjectResult = await this.projectRepository.save(projectObj);

        for (let index = 0; index < project.team_member.length; index++) {
            const element = project.team_member[index];
            await this.addTeamMember(newProjectResult.id, element);
        }

        return newProjectResult;
    }

    async getAll(query: IPagination) {
        const { skip, take } = query;

        return await this.projectRepository.find({
            select: ["id", "name", "startDate", "endDate"],
            skip: skip,
            take: take,
        });
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
        const user = await dataSource.getRepository(User).findOne({
            where: { id: userId },
        });

        if (project !== null && user !== null) {
            project?.teamMember.push(user);
            const response = await this.projectRepository.save(project);
            if (response) {
                return await this.getById(projectId);
            }
        }
    }

    async getById(id: number) {
        const response = await this.projectRepository.findOne({
            where: { id },
            relations: ["admin", "teamMember"],
        });
        const tasks = await this.taskRepository.find({
            where: { project: { id } },
        });
        return {
            ...response,
            tasks,
        };
    }
}

export default ProjectService;
