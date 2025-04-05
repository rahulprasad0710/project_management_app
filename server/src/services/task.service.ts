import { Project } from "../db/entity/project";
import { User } from "../db/entity/User";
import dataSource from "../db/data-source";
import { Task } from "../db/entity/task";
import { Priority, TaskStatus } from "../enums/Priority";
import { IPagination } from "../types/express";

interface ITask {
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    addedBy: User;
    project: Project;
    status: TaskStatus;
    priority: Priority;
}

export class TaskService {
    constructor(
        private readonly taskRepository = dataSource.getRepository(Task)
    ) {}

    async create(task: ITask) {
        const taskObj = new Task();
        taskObj.title = task.title;
        taskObj.description = task.description;
        taskObj.startDate = task.startDate;
        taskObj.endDate = task.endDate;
        taskObj.addedBy = task.addedBy;
        taskObj.project = task.project;
        taskObj.status = task.status;
        taskObj.priority = task.priority;

        return await this.taskRepository.save(taskObj);
    }

    async getAll({ skip, take }: IPagination) {
        return await this.taskRepository.find({
            skip: skip,
            take: take,
        });
    }

    async update(id: number, task: ITask) {
        const taskObj = await this.taskRepository.findOne({
            where: { id },
        });

        if (!taskObj) {
            throw new Error("Task not found");
        }

        taskObj.title = task.title;
        taskObj.description = task.description;
        taskObj.startDate = task.startDate;
        taskObj.endDate = task.endDate;

        return await this.taskRepository.save(taskObj);
    }

    async updateStatus(id: number, status: TaskStatus) {
        const taskObj = await this.taskRepository.findOne({
            where: { id },
        });

        if (!taskObj) {
            throw new Error("Task not found");
        }

        taskObj.status = status;

        return await this.taskRepository.save(taskObj);
    }

    async delete(id: number) {
        const taskObj = await this.taskRepository.findOne({
            where: { id },
        });

        if (!taskObj) {
            throw new Error("Task not found");
        }

        return await this.taskRepository.remove(taskObj);
    }

    async getByProject(projectId: number) {
        return await this.taskRepository.find({
            where: { project: { id: projectId } },
        });
    }

    async updatePriority(id: number, priority: Priority) {
        const taskObj = await this.taskRepository.findOne({
            where: { id },
        });

        if (!taskObj) {
            throw new Error("Task not found");
        }

        taskObj.priority = priority;

        return await this.taskRepository.save(taskObj);
    }

    async getById(id: number) {
        return await this.taskRepository.findOne({
            where: { id },
        });
    }
}

export default TaskService;
