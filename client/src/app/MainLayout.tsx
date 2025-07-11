"use client";

import "react-toastify/dist/ReactToastify.css";

import React, { useEffect } from "react";

import MainNavbar from "./(components)/MainNavbar";
import Sidebar from "./(components)/Sidebar";
import { ToastContainer } from "react-toastify";
import { redirect } from "next/navigation";
import { useAppSelector } from "@/store/StoreProvider";
import { useSession } from "next-auth/react";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  if (status === "loading")
    return <h1 className="text-center font-bold">Loading...</h1>;

  if (status === "unauthenticated") redirect("/");

  return (
    <div className="test-gray-900 flex min-h-screen bg-gray-100">
      <ToastContainer />
      <main className={`flex w-full flex-col bg-gray-50`}>
        <MainNavbar />

        <div className={`mt-[60px]`}>
          <Sidebar />
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
