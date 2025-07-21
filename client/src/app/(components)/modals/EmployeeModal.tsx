import * as yup from "yup";

import {
  IEmployeePayload,
  IEmployeeResponse,
  IEmployeeUpdatePayload,
  IRoleOptions,
  roleOptions,
} from "@/types/user.types";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  useCreateEmployeeMutation,
  useUpdateSprintMutation,
} from "@/store/api";

import Spinner from "../Spinner";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";

type Props = {
  onClose: () => void;
  selectedData: undefined | IEmployeeResponse;
  setSelectedData: (data: IEmployeeResponse | undefined) => void;
};

interface IFormInput {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  role: string;
}

const EmployeeModal = (props: Props) => {
  const { onClose, selectedData } = props;

  const [createSprintMutation] = useCreateEmployeeMutation();
  const [updateSprintMutation] = useUpdateSprintMutation();

  const schema = yup.object().shape({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    email: yup.string().required("Email is required"),
    mobileNumber: yup.string().required("Mobile number is required"),
    role: yup.string().required("Role is required"),
  });

  const defaultValues: IFormInput = {
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    role: "EMPLOYEE",
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
    if (selectedData?.id) {
      reset({
        firstName: selectedData.firstName,
        lastName: selectedData.lastName,
        email: selectedData.email,
        mobileNumber: selectedData.mobileNumber,
        role: selectedData.role,
      });
    }
  }, [selectedData]);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log(data);

    const payload: IEmployeePayload | IEmployeeUpdatePayload = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      mobileNumber: data.mobileNumber,
      role: data.role,
    };

    try {
      if (selectedData?.id) {
        const updatePayload: IEmployeeUpdatePayload = {
          ...payload,
          id: selectedData.id,
        };

        const response = await updateSprintMutation(updatePayload).unwrap();
        if (response.success) {
          toast.success("Project updated successfully");
          onClose();
        }
      } else {
        const addPayload: IEmployeePayload = {
          ...payload,
        };
        const response = await createSprintMutation(addPayload).unwrap();
        if (response.success) {
          toast.success("Project added successfully");
          onClose();
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong!");
    }
  };

  return (
    <div>
      {" "}
      <form className="bg-white px-4 py-2" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex w-full gap-4">
          <div className="mb-2 w-1/2">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              First Name
            </label>
            <input
              className="focus:shadow-outline mb-2 w-full appearance-none rounded border border-gray-200 bg-white px-3 py-2 leading-tight text-gray-800 shadow-sm focus:border-blue-300 focus:outline-none"
              type="text"
              placeholder="Enter first name"
              {...register("firstName", { required: true })}
            />
            {errors.firstName && (
              <p className="text-xs italic text-red-500">
                {errors.firstName?.message}
              </p>
            )}
          </div>
          <div className="mb-2 w-1/2">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Last Name
            </label>
            <input
              className="focus:shadow-outline mb-2 w-full appearance-none rounded border border-gray-200 bg-white px-3 py-2 leading-tight text-gray-800 shadow-sm focus:border-blue-300 focus:outline-none"
              type="text"
              placeholder="Enter last name"
              {...register("lastName", { required: true })}
            />
            {errors.lastName && (
              <p className="text-xs italic text-red-500">
                {errors.lastName?.message}
              </p>
            )}
          </div>
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-gray-700">
            Email
          </label>
          <input
            className="focus:shadow-outline mb-2 w-full appearance-none rounded border border-gray-200 bg-white px-3 py-2 leading-tight text-gray-800 shadow-sm focus:border-blue-300 focus:outline-none"
            type="text"
            placeholder="email address"
            {...register("email", { required: true })}
          />
          {errors.email ? (
            <p className="text-xs italic text-red-500">
              {errors.email?.message}
            </p>
          ) : (
            <p className="text-semibold text-xs text-blue-500">
              Email cannot be changed after creation.
            </p>
          )}
        </div>
        <div className="flex w-full gap-4">
          <div className="mb-4 w-1/2">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Mobile Number
            </label>
            <input
              className="focus:shadow-outline mb-2 w-full appearance-none rounded border border-gray-200 bg-white px-3 py-2 leading-tight text-gray-800 shadow-sm focus:border-blue-300 focus:outline-none"
              type="text"
              placeholder="Enter mobile number"
              {...register("mobileNumber", { required: true })}
            />
            {errors.mobileNumber && (
              <p className="text-xs italic text-red-500">
                {errors.mobileNumber?.message}
              </p>
            )}
          </div>
          <div className="mb-4 w-1/2">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Role
            </label>
            <div className="relative">
              <select
                className="block w-full appearance-none rounded border border-gray-200 bg-white px-4 py-2 pr-8 leading-tight text-gray-700 focus:border-blue-300 focus:bg-white focus:outline-none"
                {...register("role", { required: true })}
              >
                {roleOptions.map((role: IRoleOptions) => (
                  <option value={role.value} key={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="h-4 w-4 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            {errors.role && (
              <p className="text-xs italic text-red-500">
                {errors.role?.message}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-4">
          <button
            onClick={onClose}
            className="focus:shadow-outline rounded bg-gray-100 px-4 py-2 font-bold text-gray-500 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            disabled={isSubmitting}
            className={` ${isSubmitting ? "opacity-50" : ""} focus:shadow-outline rounded bg-blue-500 px-8 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none`}
          >
            {!!isSubmitting && <Spinner />}
            <span> {selectedData?.id ? "Update" : "Submit"} </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeModal;
