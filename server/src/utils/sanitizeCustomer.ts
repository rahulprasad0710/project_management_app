import { Customer } from "../db/entity/Customer";

type TPayload = {
    customer: Customer;
};

export const sanitizeCustomerResult = ({
    customer,
}: TPayload): Partial<Customer> => {
    const newItem: Partial<Customer> = {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        mobileNumber: customer.mobileNumber,
        associated_internal_company_id: customer.associated_internal_company_id,
        profilePictureUrl: customer.profilePictureUrl,
    };

    return newItem;
};
