"use client";

import * as yup from "yup";

import { SubmitHandler, useForm } from "react-hook-form";
import { signIn, useSession } from "next-auth/react";

import Google from "../(components)/icons/Google";
import Spinner from "../(components)/Spinner";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";

interface IFormInput {
  email: string;
  password: string;
}

interface ILoginPayload {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { data: session, status } = useSession();

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
    formState: { isSubmitting },
  } = useForm<IFormInput>({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  });

  const handleEmailLogin: SubmitHandler<IFormInput> = async (data) => {
    console.log(data);

    // const payload: ILoginPayload = {
    //   email: data.email,
    //   password: data.password,
    // };

    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    console.log({
      result,
    });
  };

  const handleSigninWithGoogle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await signIn("google", { callbackUrl: "/" });
      console.log("LOG: ~ handleSigninWithGoogle ~ response:", response);
    } catch (error) {
      console.log("LOG: ~ handleSigninWithGoogle ~ error:", error);
    }
  };

  return (
    <div>
      <div className="flex h-[calc(100vh-60px)] items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
          <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
            Sign In to Your Account
          </h1>

          <button
            onClick={(e) => handleSigninWithGoogle(e)}
            className="text-md flex w-full items-center justify-start gap-16 rounded border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-100"
          >
            <span className="text-center">
              <Google size={30} />
            </span>

            <span className="">Sign in with Google</span>
          </button>

          <div className="my-6 flex items-center justify-center text-gray-500">
            <hr className="flex-1 border-gray-200" />
            <span className="mx-2 text-sm">OR</span>
            <hr className="flex-1 border-gray-200" />
          </div>
          <form onSubmit={handleSubmit(handleEmailLogin)} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full rounded border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
              {...register("email", { required: true })}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full rounded border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
              {...register("password", { required: true })}
              required
            />
            <button
              disabled={isSubmitting}
              className={` ${isSubmitting ? "opacity-50" : ""} focus:shadow-outline w-full rounded bg-blue-500 bg-blue-600 px-4 px-8 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none`}
            >
              {!!isSubmitting && <Spinner />}
              Sign in with Email
            </button>
          </form>
          <div>
            <p className="mt-4 text-blue-500">Forget password ?</p>
          </div>
        </div>
      </div>
    </div>
  );
}
