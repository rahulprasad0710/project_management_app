import AppError from "../utils/AppError";
import { CredentialType } from "../enums/CredentialType";
import { Customer } from "../db/entity/Customer";
import { ErrorType } from "../enums/Eums";
import { ILike } from "typeorm";
import dataSource from "../db/data-source";

export interface ICustomerByAdmin {
    name: string;
    email: string;
    mobileNumber: string;
    associated_internal_company_id: number;
    CredentialType: CredentialType;
    isActive: boolean;
    createdAt: Date;
}

export class CustomerService {
    private readonly customerRepository = dataSource.getRepository(Customer);

    async createCustomerByAdmin(customer: ICustomerByAdmin) {
        const customerObj = new Customer();
        customerObj.name = customer.name;
        customerObj.email = customer.email;
        customerObj.mobileNumber = customer.mobileNumber;
        customerObj.associated_internal_company_id =
            customer.associated_internal_company_id;
        customerObj.isActive = true;
        customerObj.CredentialType = CredentialType.ADMIN;
        const result = await this.customerRepository.save(customerObj);
        return result;
    }

    async getById(id: number) {
        const result = await this.customerRepository.findOne({
            where: { id },
        });
        return result;
    }

    async getCustomerByMobileNumber(mobileNumber: string) {
        const result = await this.customerRepository.find({
            where: { mobileNumber: ILike(`%${mobileNumber}%`) },
        });
        return result;
    }

    /**
     * Create a new customer
     */
    async createCustomer(data: Partial<Customer>): Promise<Customer> {
        const customer = this.customerRepository.create(data);
        return await this.customerRepository.save(customer);
    }

    /**
     * Get customers with optional pagination & filters
     */
    async getAll({
        skip = 0,
        take = 10,
        search,
        isActive,
    }: {
        skip?: number;
        take?: number;
        search?: string;
        isActive?: boolean;
    }) {
        const query = this.customerRepository.createQueryBuilder("customer");

        if (search) {
            query.andWhere(
                "(customer.name LIKE :search OR customer.email LIKE :search OR customer.mobileNumber LIKE :search)",
                { search: `%${search}%` }
            );
        }

        if (typeof isActive === "boolean") {
            query.andWhere("customer.isActive = :isActive", { isActive });
        }

        query.skip(skip).take(take);

        const [data, total] = await query.getManyAndCount();

        return {
            data,
            total,
            skip,
            take,
        };
    }

    /**
     * Get customer by ID
     */
    async getCustomerById(id: number): Promise<Customer | null> {
        return await this.customerRepository.findOne({ where: { id } });
    }

    /**
     * Update customer
     */
    async update(
        id: number,
        updateData: Partial<Customer>
    ): Promise<Customer | null> {
        const customer = await this.customerRepository.findOne({
            where: { id },
        });
        if (!customer) return null;

        Object.assign(customer, updateData);
        return await this.customerRepository.save(customer);
    }

    /**
     * Delete customer
     */
    async delete(id: number): Promise<boolean> {
        const result = await this.customerRepository.delete(id);
        return result.affected !== 0;
    }
}
