"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  console.log("LOG: ~ LoginPage ~ session:", session);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const syncUserWithBackend = async () => {
    if (status !== "authenticated" || !session?.user?.email) return;
    try {
      // 1. Check if user exists
      const checkRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/check`,
        {
          method: "GET",
          headers: {
            "x-user-email": session.user.email,
          },
        },
      );

      if (checkRes.status === 404) {
        // 2. If not found, create the user
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: session.user.name,
              email: session.user.email,
              profilePicture: session.user.image,
            }),
          },
        );

        console.log("✅ User created on backend");
      } else {
        console.log("✅ User already exists");
      }
    } catch (error) {
      console.error("Error syncing user with backend", error);
    }
  };

  useEffect(() => {
    syncUserWithBackend();
  }, [session, status]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    console.log("Login response:", data);
    // Save token or redirect as needed
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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-white px-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
          <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
            Sign In to Your Account
          </h1>

          <button
            onClick={(e) => handleSigninWithGoogle(e)}
            className="flex w-full items-center justify-center gap-2 rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            {/* <FcGoogle size={20} /> */}
            Sign in with Google
          </button>

          <div className="my-6 flex items-center justify-center text-gray-500">
            <hr className="flex-1 border-gray-200" />
            <span className="mx-2 text-sm">OR</span>
            <hr className="flex-1 border-gray-200" />
          </div>
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full rounded border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full rounded border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
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
