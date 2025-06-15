import { Label } from "../db/entity/taskLabel";
import { User } from "../db/entity/User";
import dataSource from "../db/data-source";

interface ILabel {
    name: string;
    description?: string;
    addedBy: User;
}

export class LabelService {
    constructor(
        private readonly labelRepository = dataSource.getRepository(Label)
    ) {}

    async create(label: ILabel) {
        const labelObj = new Label();
        labelObj.name = label.name;
        labelObj.description = label.description || "";
        labelObj.addedBy = label.addedBy;
        labelObj.addedAt = new Date();
        labelObj.isActive = true;

        return await this.labelRepository.save(labelObj);
    }

    async getAll(isActive: boolean) {
        try {
            const response = await this.labelRepository.find({
                where: { isActive: isActive },
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async getById(id: number) {
        return await this.labelRepository.findOne({
            where: { id, isActive: true },
            relations: ["addedBy"],
        });
    }

    async update(id: number, updateFields: Partial<ILabel>) {
        const label = await this.labelRepository.findOneBy({ id });
        if (!label) throw new Error("Label not found");

        Object.assign(label, updateFields);
        return await this.labelRepository.save(label);
    }

    async deactivate(id: number, isActive: boolean) {
        const label = await this.labelRepository.findOneBy({ id });
        if (!label) throw new Error("Label not found");

        label.isActive = isActive;
        return await this.labelRepository.save(label);
    }
}

export default LabelService;
