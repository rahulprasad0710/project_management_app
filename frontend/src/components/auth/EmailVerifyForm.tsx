import * as yup from "yup";

import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import {
    Link,
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router-dom";

import Button from "../ui/button/Button";
import Checkbox from "../form/input/Checkbox";
import CompanyIcon from "../molecules/CompanyIcon";
import Label from "../form/Label";
import { SplinePointer } from "lucide-react";
import type { SubmitHandler } from "react-hook-form";
import { getCustomerError } from "@utils/customError";
import { inputFieldClass } from "@/utils/style";
import { toast } from "react-toastify";
import { useCreateVerifyEmailMutation } from "@api/api";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";

interface IFormInput {
    password: string;
    confirmPassword: string;
}

function EmailVerifyForm() {
    const schema = yup.object().shape({
        confirmPassword: yup.string().required("Email is required"),
        password: yup.string().required("Password is required"),
    });
    const [searchParams, setSearchParams] = useSearchParams();
    const params = useParams();
    const navigate = useNavigate();

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

    const [showPassword, setShowPassword] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    const handleSubmitForm: SubmitHandler<IFormInput> = async (data) => {
        toast.error("ttt");

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
                navigate("/auth/login");
            }
        } catch (err) {
            console.log(err);
            const error = getCustomerError(err);
            toast.error(error.message);
        }
    };
    return (
        <div className='flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar'>
            <div className='w-full max-w-md mx-auto mb-5 sm:pt-10'>
                <Link
                    to='/'
                    className='inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                >
                    <ChevronLeftIcon className='size-5' />
                    Back to dashboard
                </Link>
            </div>
            <div className='flex flex-col justify-center flex-1 w-full max-w-md mx-auto'>
                <div>
                    <div className='mb-5 sm:mb-8'>
                        <CompanyIcon />
                        <h1 className='mb-2 mt-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md'>
                            Email Verification
                        </h1>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                            Enter your password to sign up!
                        </p>
                    </div>
                    <div>
                        <form onSubmit={handleSubmit(handleSubmitForm)}>
                            <div className='space-y-5'>
                                {/* <!-- Email --> */}
                                <div>
                                    <Label>
                                        Password
                                        <span className='text-error-500'>
                                            *
                                        </span>
                                    </Label>
                                    <div className='relative'>
                                        <input
                                            className={inputFieldClass({})}
                                            {...register("password", {
                                                required: true,
                                            })}
                                            placeholder='Enter your password'
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                        />
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
                                {/* <!-- Password --> */}
                                <div>
                                    <Label>
                                        Confirm Password
                                        <span className='text-error-500'>
                                            *
                                        </span>
                                    </Label>
                                    <div className='relative'>
                                        <input
                                            className={inputFieldClass({})}
                                            {...register("confirmPassword", {
                                                required: true,
                                            })}
                                            placeholder='Confirm your password'
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                        />
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
                                {/* <!-- Checkbox --> */}
                                <div className='flex items-center gap-3'>
                                    <Checkbox
                                        className='w-5 h-5'
                                        checked={isChecked}
                                        onChange={setIsChecked}
                                    />
                                    <p className='inline-block font-normal text-gray-500 dark:text-gray-400'>
                                        By creating an account means you agree
                                        to the{" "}
                                        <span className='text-gray-800 dark:text-white/90'>
                                            Terms and Conditions,
                                        </span>{" "}
                                        and our{" "}
                                        <span className='text-gray-800 dark:text-white'>
                                            Privacy Policy
                                        </span>
                                    </p>
                                </div>
                                {/* <!-- Button --> */}
                                <div>
                                    <Button
                                        onClick={handleSubmit(handleSubmitForm)}
                                        disabled={isSubmitting}
                                        className='w-full'
                                    >
                                        {!!isSubmitting && <SplinePointer />}
                                        Submit
                                    </Button>
                                </div>
                            </div>
                        </form>

                        <div className='mt-5'>
                            <p className='text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start'>
                                Already have an account? {""}
                                <Link
                                    to='/signin'
                                    className='text-brand-500 hover:text-brand-600 dark:text-brand-400'
                                >
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmailVerifyForm;
