"use client";

import * as yup from "yup";

import { SubmitHandler, useForm } from "react-hook-form";
import { useParams, useSearchParams } from "next/navigation";

import CompanyIcon from "@/app/(components)/atoms/CompanyIcon";
import { Spinner } from "@/app/(components)/atoms/Spinner";
import { getCustomerError } from "@/app/utils/customError";
import { toast } from "react-toastify";
import { useCreateVerifyEmailMutation } from "@/store/api";
import { yupResolver } from "@hookform/resolvers/yup";

interface IFormInput {
  password: string;
  confirmPassword: string;
}

function VerifyEmail() {
  const schema = yup.object().shape({
    confirmPassword: yup.string().required("Email is required"),
    password: yup.string().required("Password is required"),
  });
  const searchParams = useSearchParams();
  const params = useParams();

  const { id } = params;

  const [createMutation] = useCreateVerifyEmailMutation();

  const defaultValues: IFormInput = {
    confirmPassword: "",
    password: "",
  };

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<IFormInput>({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  });

  const handleSubmitForm: SubmitHandler<IFormInput> = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const tokenFromUrl = searchParams.get("token");

    if (!tokenFromUrl) {
      toast.error("Invalid token");
      return;
    }

    try {
      const response = await createMutation({
        password: data.password,
        token: tokenFromUrl,
        id: Number(id),
      }).unwrap();
      console.log("response", response);

      if (response?.success) {
        toast.success("Email verified successfully");
        window.location.href = "/login";
      }
    } catch (err) {
      console.log(err);
      const error = getCustomerError(err);
      toast.error(error.message);
    }
  };

  return (
    <div>
      <div className="flex h-[calc(100vh-60px)] items-center justify-center bg-gray-50 px-4">
        <div className="mb-44 w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
          <div className="mb-6 flex flex-col items-center justify-center gap-4">
            <CompanyIcon />
            <h1 className="text-center text-2xl font-bold text-gray-800">
              Verify Email
            </h1>
          </div>

          <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
            <input
              type="password"
              placeholder="Password"
              className="w-full rounded border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
              {...register("password", { required: true })}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full rounded border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
              {...register("confirmPassword", { required: true })}
              required
            />
            <div className="w-full">
              <button
                disabled={isSubmitting}
                className={` ${isSubmitting ? "opacity-50" : ""} focus:shadow-outline mt-6 w-full rounded bg-blue-600 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none`}
              >
                {!!isSubmitting && <Spinner />}
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
