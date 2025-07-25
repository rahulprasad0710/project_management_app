import { InternalCompany } from "../db/entity/InternalCompany";
import dataSource from "../db/data-source";

interface IInternalCompany {
    name: string;
    slug: string;
    logoUrl?: string;
    address?: string;
    contactEmail?: string;
    contactPhone?: string;
}

export class InternalCompanyService {
    constructor(
        private readonly companyRepository = dataSource.getRepository(
            InternalCompany
        )
    ) {}

    async create(companyData: IInternalCompany) {
        const company = new InternalCompany();
        company.name = companyData.name;
        company.slug = companyData.slug;
        company.logoUrl = companyData.logoUrl || "";
        company.address = companyData.address || "";
        company.contactEmail = companyData.contactEmail || "";
        company.contactPhone = companyData.contactPhone || "";
        company.isActive = true;

        return await this.companyRepository.save(company);
    }

    async getAll() {
        return await this.companyRepository.find({
            relations: ["projects"],
        });
    }

    async getById(id: number) {
        return await this.companyRepository.findOne({
            where: { id },
            relations: ["projects"],
        });
    }

    async update(id: number, updateFields: Partial<IInternalCompany>) {
        const company = await this.companyRepository.findOneBy({ id });
        if (!company) throw new Error("Internal company not found");

        Object.assign(company, updateFields);
        return await this.companyRepository.save(company);
    }

    async deactivate(id: number, isActive: boolean) {
        const company = await this.companyRepository.findOneBy({ id });
        if (!company) throw new Error("Internal company not found");

        company.isActive = isActive;
        return await this.companyRepository.save(company);
    }
}

export default InternalCompanyService;
