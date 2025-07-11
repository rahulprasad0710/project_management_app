"use client";

import "react-toastify/dist/ReactToastify.css";

import React, { useEffect } from "react";
import StoreProvider, { useAppSelector } from "@/store/StoreProvider";
import { ToastContainer, toast } from "react-toastify";

import MainNavbar from "./(components)/MainNavbar";
import Navbar from "./(components)/Navbar";
import { SessionProvider } from "next-auth/react";
import Sidebar from "./(components)/Sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className="test-gray-900 flex min-h-screen bg-gray-100">
      <ToastContainer />
      <main className={`flex w-full flex-col bg-gray-50`}>
        <MainNavbar />
        <div className="relative mt-[60px]">
          <Sidebar />
          <div>{children}</div>
        </div>
      </main>
    </div>
  );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <StoreProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </StoreProvider>
    </SessionProvider>
  );
};

export default DashboardWrapper;
