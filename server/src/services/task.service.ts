import { ILike, In } from "typeorm";
import { ITask, ITaskPagination, IUpdateTaskPayload } from "../types/payload";
import { Priority, TaskStatusEnum } from "../enums/Priority";

import { Task } from "../db/entity/task";
import { UploadFile } from "../db/entity/uploads";
import createPagination from "../utils/createPagination";
import dataSource from "../db/data-source";

export class TaskService {
    constructor(
        private readonly taskRepository = dataSource.getRepository(Task),
        private readonly uploadRepository = dataSource.getRepository(UploadFile)
    ) {}

    async create(task: ITask) {
        const taskObj = new Task();

        const totalCount = await this.taskRepository.count();
        const taskNumber = String(totalCount + 1).padStart(4, "0");

        taskObj.title = task.title;
        taskObj.taskNumber = `JT-${taskNumber}`;
        taskObj.addedBy = task.addedBy;
        taskObj.assignedTo = task.assignedTo;
        taskObj.description = task.description;
        taskObj.addedDate = task.addedDate;
        taskObj.assignedBy = task.assignedBy;
        // taskObj.status = task.status;
        taskObj.priority = task.priority;
        taskObj.project = task.project;
        taskObj.feature = task.featureId;
        taskObj.sprint = task.sprint;
        if (task.taskLabel) {
            taskObj.taskLabel = task.taskLabel;
        }
        console.log({
            taskObj,
        });
        const result = await this.taskRepository.save(taskObj);

        if (task.taskUploads.length > 0) {
            await this.addAttachments(result.id, task.taskUploads);
        }

        return await this.taskRepository.save(taskObj);
    }

    async getAll(query: ITaskPagination) {
        const {
            skip,
            take,
            isPaginationEnabled,
            priority,
            labels,
            assignedTo,
            keyword,
            projectId,
            featureId,
            sprintId,
        } = query;

        const result = await this.taskRepository.find({
            skip: skip,
            take: take,
            order: {
                id: "DESC",
            },
            relations: ["assignedTo", "taskLabel"],
            where: {
                ...(sprintId ? { sprint: { id: sprintId } } : {}),
                ...(projectId ? { project: { id: projectId } } : {}),
                ...(featureId ? { feature: { id: featureId } } : {}),
                ...(keyword ? { taskNumber: ILike(`%${keyword}%`) } : {}),
                ...(priority ? { priority: In(priority) } : {}),
                ...(labels ? { taskLabel: In(labels) } : {}),
                ...(assignedTo ? { assignedTo: In(assignedTo) } : {}),
            },
        });

        const totalCount = await this.taskRepository.find({
            where: {
                ...(sprintId ? { sprint: { id: sprintId } } : {}),
                ...(projectId ? { project: { id: projectId } } : {}),
                ...(featureId ? { feature: { id: featureId } } : {}),
                ...(keyword ? { taskNumber: ILike(`%${keyword}%`) } : {}),
                ...(priority ? { priority: In(priority) } : {}),
                ...(labels ? { taskLabel: In(labels) } : {}),
                ...(assignedTo ? { assignedTo: In(assignedTo) } : {}),
            },
        });
        return {
            result,
            pagination: createPagination(
                skip,
                take,
                totalCount.length,
                isPaginationEnabled
            ),
        };
    }

    async update2(id: number, task: ITask) {
        const taskObj = await this.taskRepository.findOne({
            where: { id },
        });

        if (!taskObj) {
            throw new Error("Task not found");
        }

        taskObj.title = task.title;
        taskObj.description = task.description;
        taskObj.addedDate = task.addedDate;

        return await this.taskRepository.save(taskObj);
    }

    async update(id: number, task: IUpdateTaskPayload) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const taskObj = new Task();
            taskObj.title = task.title;
            taskObj.addedBy = task.addedBy;
            taskObj.assignedTo = task.assignedTo;
            taskObj.description = task.description;
            taskObj.addedDate = task.addedDate;
            taskObj.assignedBy = task.assignedBy;
            // taskObj.status = task.status;
            taskObj.priority = task.priority;
            taskObj.project = task.project;
            const response = await this.taskRepository.update(id, taskObj);

            if (task.taskUploads && task.updatedTaskUploads) {
                await this.addAttachments(id, [
                    ...task.taskUploads,
                    ...task.updatedTaskUploads,
                ]);
            }

            await queryRunner.commitTransaction();
            return response;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async updateStatus(id: number, status: TaskStatusEnum) {
        const taskObj = await this.taskRepository.findOne({
            where: { id },
        });

        if (!taskObj || !status) {
            throw new Error("Task not found");
        }

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
            relations: [
                "taskUploads",
                "taskLabel",
                "assignedBy",
                "assignedTo",
                "sprint",
            ],
        });
    }

    async addAttachments(taskId: number, uploadIds: string[]) {
        const task = await this.taskRepository.findOne({
            where: { id: taskId },
            relations: ["taskUploads"],
        });

        const uploadResponse = (
            await Promise.all(
                uploadIds.map(async (uploadId) => {
                    return await this.uploadRepository.findOne({
                        where: { id: uploadId },
                    });
                })
            )
        ).filter((uploadId): uploadId is UploadFile => uploadId !== null);

        if (
            task !== null &&
            uploadResponse !== null &&
            uploadResponse.length > 0
        ) {
            task.taskUploads = uploadResponse;
            const response = await this.taskRepository.save(task);
            if (response) {
                return response;
            }
        }
    }
}

export default TaskService;
