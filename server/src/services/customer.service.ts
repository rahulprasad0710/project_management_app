import AppError from "../utils/AppError";
import { CredentialType } from "../enums/CredentialType";
import { Customer } from "../db/entity/Customer";
import { ErrorType } from "../enums/Eums";
import dataSource from "../db/data-source";

interface ICustomerByAdmin {
    name: string;
    email: string;
    mobileNumber: string;
    associated_internal_company_id: number;
}

export class CustomerService {
    private readonly customerRepository = dataSource.getRepository(Customer);

    async getAll() {
        const result = await this.customerRepository.find();
        return {
            result,
            pagination: {
                total: result.length,
                page: 1,
                limit: 10,
                offset: 0,
            },
        };
    }

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
        if (!result) {
            throw new AppError(
                "Customer not found",
                404,
                ErrorType.NOT_FOUND_ERROR
            );
        }
        return result;
    }
}
