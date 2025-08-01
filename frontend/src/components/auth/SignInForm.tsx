import * as yup from "yup";

import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import { Link, useNavigate } from "react-router-dom";

import Button from "../ui/button/Button";
import Checkbox from "../form/input/Checkbox";
import Label from "../form/Label";
import type { SubmitHandler } from "react-hook-form";
import { getCustomerError } from "@/utils/customError";
import { inputFieldClass } from "@/utils/style";
import { setAuthenticateEmployeeDetailsData } from "@/store";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/store/reduxHook";
import { useCreateLoginEmployeeMutation } from "@api/api";
// import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";

interface IFormInput {
    email: string;
    password: string;
}

export default function SignInForm() {
    const [createMutation] = useCreateLoginEmployeeMutation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [showPassword, setShowPassword] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const schema = yup.object().shape({
        email: yup.string().required("Email is required"),
        password: yup.string().required("Password is required"),
    });

    const defaultValues: IFormInput = {
        email: "",
        password: "",
    };

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<IFormInput>({
        defaultValues: defaultValues,
        resolver: yupResolver(schema),
    });

    const handleSubmitForm: SubmitHandler<IFormInput> = async (data) => {
        console.log(data);

        try {
            const response = await createMutation({
                email: data.email,
                password: data.password,
            }).unwrap();
            console.log("response", response);

            if (response?.success) {
                toast.success("Login successfully");
                dispatch(setAuthenticateEmployeeDetailsData(response.data));
                localStorage.setItem("accessToken", response.data.accessToken);
                navigate("/admin/dashboard");
            }
        } catch (err) {
            console.log(err);
            const error = getCustomerError(err);
            toast.error(error.message);
        }
    };

    return (
        <div className='flex flex-col flex-1'>
            <div className='w-full max-w-md pt-6 mx-auto'>
                <Link
                    to='/'
                    className='inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                >
                    <ChevronLeftIcon className='size-5' />
                    Back to home page
                </Link>
            </div>
            <div className='flex flex-col justify-center flex-1 w-full max-w-md mx-auto'>
                <div>
                    <div className='mb-5 sm:mb-8'>
                        <h1 className='mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md'>
                            Login
                        </h1>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                            Enter your email and password to sign in!
                        </p>
                    </div>
                    <div>
                        {/* social login before */}
                        <form onSubmit={handleSubmit(handleSubmitForm)}>
                            <div className='space-y-6'>
                                <div>
                                    <Label>
                                        Email{" "}
                                        <span className='text-error-500'>
                                            *
                                        </span>{" "}
                                    </Label>
                                    <div className='relative'>
                                        <input
                                            className={inputFieldClass({})}
                                            {...register("email", {
                                                required: true,
                                            })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label>
                                        Password{" "}
                                        <span className='text-error-500'>
                                            *
                                        </span>{" "}
                                    </Label>
                                    <div className='relative'>
                                        <div className='relative'>
                                            <input
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                placeholder='Enter your password'
                                                className={inputFieldClass({})}
                                                {...register("password", {
                                                    required: true,
                                                })}
                                            />
                                        </div>
                                        <span
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className='absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2'
                                        >
                                            {showPassword ? (
                                                <EyeIcon className='fill-gray-500 dark:fill-gray-400 size-5' />
                                            ) : (
                                                <EyeCloseIcon className='fill-gray-500 dark:fill-gray-400 size-5' />
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <div className='flex items-center gap-3'>
                                        <Checkbox
                                            checked={isChecked}
                                            onChange={setIsChecked}
                                        />
                                        <span className='block font-normal text-gray-700 text-theme-sm dark:text-gray-400'>
                                            Keep me logged in
                                        </span>
                                    </div>
                                    <Link
                                        to='/reset-password'
                                        className='text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400'
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <div>
                                    <Button
                                        disabled={isSubmitting}
                                        className='w-full'
                                        size='sm'
                                        onClick={handleSubmit(handleSubmitForm)}
                                    >
                                        Sign in
                                    </Button>
                                </div>
                            </div>
                        </form>

                        <div className='mt-5'>
                            <p className='text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start'>
                                Don&apos;t have an account? {""}
                                <Link
                                    to='/signup'
                                    className='text-brand-500 hover:text-brand-600 dark:text-brand-400'
                                >
                                    Sign Up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
