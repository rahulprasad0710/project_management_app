// "use client";

import Header from "../(components)/Header";
import Link from "next/link";
import React from "react";
import { SquarePlus } from "lucide-react";

const EmployeePage = () => {
  return (
    <div className="container mx-auto mt-6 bg-white px-4 lg:px-8 lg:pt-2 xl:max-w-7xl">
      <div className="my-4 flex items-center justify-between">
        <Header title="Employee" />

        <div className="flex flex-wrap justify-end gap-4">
          <Link
            href="/employees/add"
            className="flex min-w-[200px] items-center rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
            <span>
              <SquarePlus className="mr-3 h-5 w-5" />
            </span>
            <span>Add new employee</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmployeePage;
