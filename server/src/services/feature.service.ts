import { Feature } from "../db/entity/Feature";
import { FeatureTaskStatus } from "../db/entity/FeatureTaskStatus";
import { Task } from "../db/entity/task";
import dataSource from "../db/data-source";

class FeatureService {
    constructor(
        private readonly featureTaskStatusRepository = dataSource.getRepository(
            FeatureTaskStatus
        ),
        private readonly taskRepository = dataSource.getRepository(Task)
    ) {}

    /**
     * This method retrieves all task statuses associated with a specific feature ID.
     * @param featureId :string - The ID of the feature to retrieve task statuses
     * @returns FeatureTaskStatus[]
     * @description Get all task status for a feature
     */
    async getTasksByFeatureId(featureId: number) {
        return await this.taskRepository.find({
            where: { feature: { id: featureId } },
        });
    }

    /**
     * This method retrieves all task statuses associated with a specific feature ID.
     * @param featureId :string - The ID of the feature to retrieve task statuses
     * @returns FeatureTaskStatus[]
     * @description Get all task status for a feature
     */
    async getTaskStatusByFeatureId(featureId: number) {
        const result = await this.featureTaskStatusRepository.find({
            where: { feature: { id: featureId } },
            relations: ["taskStatus"],
        });

        return result;
    }
}

export default FeatureService;
