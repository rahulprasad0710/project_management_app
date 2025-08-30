import * as yup from "yup";

import type {
    IEmployeePayload,
    IEmployeeResponse,
    IEmployeeUpdatePayload,
    IMultiList,
} from "@/types/config.types";
import { classForSelect, inputFieldClass } from "@/utils/style";
import {
    useCreateEmployeeMutation,
    useUpdateEmployeeMutation,
} from "@api/hooks/useEmployee";
import { useEffect, useState } from "react";

import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import ModalHeader from "@/components/atoms/ModalHeader";
import MultiSelect from "@/components/atoms/MultiSelect";
import { Spinner } from "@/components/atoms/Spinner";
import type { SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useGetAllRolesQuery } from "@api/hooks/useRoles";
import { useGetInternalCompaniesQuery } from "@/api/hooks/useInternalCompany";
import { yupResolver } from "@hookform/resolvers/yup";

type Props = {
    selectedData: undefined | IEmployeeResponse;
    setSelectedData: (data: IEmployeeResponse | undefined) => void;
    handleCloseModal: () => void;
};

interface IFormInput {
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    role: string;
}

const EmployeeModal = (props: Props) => {
    const { selectedData, handleCloseModal } = props;
    const [selectedInternalCompany, setSelectedInternalCompany] = useState<
        IMultiList[]
    >([]);
    const [createMutation] = useCreateEmployeeMutation();
    const [updateMutation] = useUpdateEmployeeMutation();

    const { data: internalCompanyList, isFetching } =
        useGetInternalCompaniesQuery({
            isPaginationEnabled: false,
            isActive: true,
            page: 1,
            pageSize: 20,
        });

    const schema = yup.object().shape({
        firstName: yup.string().required("First name is required"),
        lastName: yup.string().required("Last name is required"),
        email: yup.string().required("Email is required"),
        mobileNumber: yup.string().required("Mobile number is required"),
        role: yup.string().required("Role is required"),
    });

    const { data: roleOptions } = useGetAllRolesQuery({
        isPaginationEnabled: false,
        page: 1,
        pageSize: 10,
    });

    const defaultValues: IFormInput = {
        firstName: "",
        lastName: "",
        email: "",
        mobileNumber: "",
        role: "",
    };

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<IFormInput>({
        defaultValues: defaultValues,
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if (selectedData?.id && roleOptions?.data?.result?.length) {
            reset({
                firstName: selectedData.firstName,
                lastName: selectedData.lastName,
                email: selectedData.email,
                mobileNumber: selectedData.mobileNumber,
                role: String(selectedData.roleId),
            });
        }
    }, [selectedData]);

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        console.log(data);

        const payload: IEmployeePayload = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            mobileNumber: data.mobileNumber,
            role: Number(data.role),
            internalCompany: selectedInternalCompany.map((item) =>
                Number(item.value)
            ),
        };

        try {
            if (selectedData?.id) {
                const updatePayload: IEmployeeUpdatePayload = {
                    ...payload,
                    id: selectedData.id,
                };

                const response = await updateMutation(updatePayload).unwrap();
                if (response.success) {
                    toast.success("Employee updated successfully");
                    handleCloseModal();
                }
            } else {
                const addPayload: IEmployeePayload = {
                    ...payload,
                };
                const response = await createMutation(addPayload).unwrap();
                if (response.success) {
                    toast.success("New employee added successfully");
                    handleCloseModal();
                }
            }
        } catch (error) {
            console.log(error);
            toast.error("Something Went Wrong!");
        }
    };

    return (
        <div className='relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-6'>
            <div className='p-4 '>
                <ModalHeader
                    isAdd={selectedData?.id ? false : true}
                    title='Employee'
                />
            </div>
            <form
                className='bg-white px-4 py-4 dark:bg-slate-800'
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className='flex w-full gap-4'>
                    <div className='mb-2 w-1/2'>
                        <Label>
                            First Name
                            <span className='text-error-500'>*</span>
                        </Label>
                        <div className='relative'>
                            <input
                                className={inputFieldClass({
                                    error: errors.firstName ? true : false,
                                })}
                                type='text'
                                placeholder='Enter first name'
                                {...register("firstName", { required: true })}
                            />
                            {errors.firstName && (
                                <p className='text-xs italic text-red-500'>
                                    {errors.firstName?.message}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className='mb-2 w-1/2'>
                        <Label>
                            Last Name
                            <span className='text-error-500'>*</span>
                        </Label>
                        <div className='relative'>
                            <input
                                className={inputFieldClass({
                                    error: errors.lastName ? true : false,
                                })}
                                type='text'
                                placeholder='Enter last name'
                                {...register("lastName", { required: true })}
                            />
                            {errors.lastName && (
                                <p className='text-xs italic text-red-500'>
                                    {errors.lastName?.message}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                <div className='mb-4'>
                    <Label>
                        Email
                        <span className='text-error-500'>*</span>
                    </Label>
                    <div className='relative'>
                        <input
                            className={inputFieldClass({
                                error: errors.email ? true : false,
                            })}
                            type='text'
                            placeholder='email address'
                            {...register("email", { required: true })}
                        />
                        {errors.email ? (
                            <p className='text-xs italic text-red-500'>
                                {errors.email?.message}
                            </p>
                        ) : (
                            <p className='text-semibold text-xs text-blue-500'>
                                Email cannot be changed after creation.
                            </p>
                        )}
                    </div>
                </div>
                <div className='flex w-full gap-4'>
                    <div className='mb-4 w-1/2'>
                        <Label>
                            Mobile Number
                            <span className='text-error-500'>*</span>
                        </Label>
                        <div>
                            <input
                                className={inputFieldClass({
                                    error: errors.mobileNumber ? true : false,
                                })}
                                type='text'
                                placeholder='Enter mobile number'
                                {...register("mobileNumber", {
                                    required: true,
                                })}
                            />
                            {errors.mobileNumber && (
                                <p className='text-xs italic text-red-500'>
                                    {errors.mobileNumber?.message}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className='mb-4 w-1/2'>
                        <Label>
                            Role <span className='text-error-500'>*</span>{" "}
                        </Label>
                        <div className='relative'>
                            <select
                                className={classForSelect}
                                {...register("role", { required: true })}
                            >
                                <option
                                    className='text-gray-500!'
                                    value=''
                                    disabled
                                >
                                    Select Role
                                </option>
                                {roleOptions?.data?.result.map((role) => (
                                    <option value={role.id} key={role.id}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
                                <svg
                                    className='h-4 w-4 fill-current'
                                    xmlns='http://www.w3.org/2000/svg'
                                    viewBox='0 0 20 20'
                                >
                                    <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
                                </svg>
                            </div>
                        </div>
                        {errors.role && (
                            <p className='text-xs italic text-red-500'>
                                {errors.role?.message}
                            </p>
                        )}
                    </div>
                </div>
                <div className='w-full mb-8'>
                    <Label>
                        Internal Company
                        <span className='text-error-500'>*</span>
                    </Label>
                    <MultiSelect
                        isDisabled={isFetching}
                        placeholder='Select Internal Company'
                        selectedList={selectedInternalCompany}
                        setSelectList={setSelectedInternalCompany}
                        list={
                            (internalCompanyList?.data &&
                                internalCompanyList?.data?.result?.map(
                                    (company) => {
                                        const payload = {
                                            label: company.name,
                                            value: String(company.id),
                                        };
                                        return payload;
                                    }
                                )) ??
                            []
                        }
                    />
                    {errors.role && (
                        <p className='text-xs italic text-red-500'>
                            {errors.role?.message}
                        </p>
                    )}
                </div>

                <div className=' flex items-center justify-end gap-4'>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={handleCloseModal}
                    >
                        Cancel
                    </Button>
                    <Button
                        type='submit'
                        className='px-6!'
                        size='sm'
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <Spinner />
                        ) : (
                            <span>
                                {" "}
                                {selectedData?.id ? "Update" : "Submit"}{" "}
                            </span>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default EmployeeModal;
