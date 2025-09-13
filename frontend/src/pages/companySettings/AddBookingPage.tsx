import * as yup from "yup";

import { useEffect, useState } from "react";

import type { ICustomerResponse } from "@/types/hotel.type";
import InfiniteScrollSelect from "@/components/common/InfiniteLoading";
import Label from "@/components/form/Label";
import RoomInformation from "./components/RoomInformation";
import Switch from "@/components/form/switch/Switch";
import { inputFieldClass } from "@/utils/style";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useLazyGetAllCustomerQuery } from "@apiHooks/useCustomer";
import { yupResolver } from "@hookform/resolvers/yup";

interface IFormInput {
    name: string;
    email: string;
    mobileNumber: string;
}

const defaultValues: IFormInput = {
    name: "",
    email: "",
    mobileNumber: "",
};

const AddBookingPage = () => {
    const [fetchCustomerAll] = useLazyGetAllCustomerQuery();

    const [selectedCustomer, setSelectedCustomer] = useState<
        ICustomerResponse | undefined
    >();

    const schema = yup.object().shape({
        name: yup.string().required("Name is required"),
        email: yup.string().required("Email is required"),
        mobileNumber: yup.string().required("Mobile number is required"),
    });

    const [alreadyACustomer, setAlreadyACustomer] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<IFormInput>({
        defaultValues: defaultValues,
        resolver: yupResolver(schema),
    });

    const newCustomerName = watch("name");
    const newCustomerMobileNumber = watch("mobileNumber");

    useEffect(() => {
        if (selectedCustomer && alreadyACustomer) {
            reset({
                name: selectedCustomer?.name,
                email: selectedCustomer?.email,
                mobileNumber: selectedCustomer?.mobileNumber,
            });
        }

        if (!alreadyACustomer) {
            reset({
                name: "",
                email: "",
                mobileNumber: "",
            });
        }

        if (selectedCustomer === undefined) {
            reset({
                name: "",
                email: "",
                mobileNumber: "",
            });
        }
    }, [selectedCustomer, alreadyACustomer]);

    return (
        <div className='rounded-md border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]'>
            <div className='flex flex-col justify-end md:justify-between gap-5  px-5 pb-4 sm:flex-row sm:items-center '>
                <div>
                    <h3 className='text-lg font-semibold text-gray-800 dark:text-white/90'>
                        Bookings
                    </h3>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                        Add New Bookings
                    </p>
                </div>
                <div className='flex gap-12 items-center'>
                    <div className='w-[320px]'>
                        <InfiniteScrollSelect<ICustomerResponse>
                            fetchAll={fetchCustomerAll}
                            getOptionLabel={(item) => {
                                return `${item?.mobileNumber} | ${item?.name}`;
                            }}
                            getOptionValue={(item) => item?.id}
                            preselectedValue={undefined}
                            onSelect={(item) => setSelectedCustomer(item)}
                            placeholder={"Select customer"}
                            isSelectDisabled={!alreadyACustomer}
                        />
                    </div>
                    <Switch
                        onChange={() => {
                            if (alreadyACustomer) {
                                setSelectedCustomer(undefined);
                                reset(defaultValues);
                            }
                            setAlreadyACustomer((prev) => !prev);
                        }}
                        defaultChecked={alreadyACustomer}
                        label='Already a customer?'
                    />
                </div>
            </div>
            <div className='rounded-lg border border-gray-200 p-4 lg:p-4 dark:border-gray-800 mb-6'>
                <h4 className='text-lg font-semibold text-gray-800 lg:mb-4 dark:text-white/90'>
                    Customer Information
                </h4>
                <form className='bg-white px-4 py-4 dark:bg-slate-800'>
                    <div className='grid grid-cols-3 gap-8 mb-4'>
                        <div className='col-span-3 md:col-span-1'>
                            <Label>
                                Customer's Name
                                <span className='text-error-500'>*</span>
                            </Label>
                            {alreadyACustomer ? (
                                <p className='text-md font-medium text-gray-800 dark:text-white/90'>
                                    {selectedCustomer?.name}
                                </p>
                            ) : (
                                <div className='relative'>
                                    <input
                                        disabled={alreadyACustomer}
                                        className={inputFieldClass({
                                            error: errors.name ? true : false,
                                        })}
                                        type='text'
                                        placeholder='Enter Name'
                                        {...register("name", {
                                            required: true,
                                        })}
                                    />
                                    {errors.name && (
                                        <p className='text-xs italic text-red-500'>
                                            {errors.name?.message}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className='col-span-3 md:col-span-1'>
                            <Label>
                                Mobile Number
                                <span className='text-error-500'>*</span>
                            </Label>
                            {alreadyACustomer ? (
                                <p className='text-md font-medium text-gray-800 dark:text-white/90'>
                                    {selectedCustomer?.mobileNumber}
                                </p>
                            ) : (
                                <div className='relative'>
                                    <input
                                        disabled={alreadyACustomer}
                                        className={inputFieldClass({
                                            error: errors.mobileNumber
                                                ? true
                                                : false,
                                        })}
                                        type='number'
                                        placeholder='Enter last name'
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
                            )}
                        </div>
                        <div className='col-span-3 md:col-span-1'>
                            <Label>
                                Email
                                <span className='text-error-500'>*</span>
                            </Label>

                            {alreadyACustomer ? (
                                <p className='text-md font-medium text-gray-800 dark:text-white/90'>
                                    {selectedCustomer?.email}
                                </p>
                            ) : (
                                <div className='relative'>
                                    <input
                                        disabled={alreadyACustomer}
                                        className={inputFieldClass({
                                            error: errors.email ? true : false,
                                        })}
                                        type='text'
                                        placeholder='email address'
                                        {...register("email", {
                                            required: true,
                                        })}
                                    />
                                    {errors.email && (
                                        <p className='text-xs italic text-red-500'>
                                            {errors.email?.message}
                                        </p>
                                    )}

                                    {!errors?.email && !alreadyACustomer && (
                                        <p className='text-semibold text-xs text-blue-500'>
                                            Email is required and can't be
                                            changed after creation.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </form>
            </div>
            <RoomInformation
                selectedCustomer={selectedCustomer}
                newCustomerName={newCustomerName}
                newCustomerMobileNumber={newCustomerMobileNumber}
                customerError={errors}
                handleSubmitCustomerForm={handleSubmit}
            />
        </div>
    );
};

export default AddBookingPage;
