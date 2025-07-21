"use client";

import {
  Check,
  ContactRound,
  SquarePen,
  SquarePlus,
  UserRoundCheck,
  UserRoundX,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";

import EmployeeModal from "../(components)/modals/EmployeeModal";
import Header from "@/app/(components)/Header";
import { IEmployeeResponse } from "@/types/user.types";
import Modal from "@/app/(components)/Modal";
import ReactTable from "../(components)/ReactTable";
import SearchBar from "@/app/(components)/molecules/SearchBar";
import SprintModal from "@/app/(components)/modals/SprintModal";
import UserAvatar from "../(components)/molecules/UserAvatar";
import { createColumnHelper } from "@tanstack/react-table";
import { useLazyGetEmployeesQuery } from "@/store/api";

const EmployeeList = () => {
  const [isSprintActive, setIsSprintActive] = useState<boolean>(true);
  const [fetchAll, { isFetching, data }] = useLazyGetEmployeesQuery();

  useEffect(() => {
    fetchAll({
      isPaginationEnabled: true,
      page: 1,
      pageSize: 10,
      isActive: isSprintActive,
    });
  }, [isSprintActive]);

  const [toggle, setToggle] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<
    undefined | IEmployeeResponse
  >();
  const [keyword, setKeyword] = useState<string>("");

  const handleToggleModal = () => {
    setToggle(!toggle);
  };

  const handleEdit = (data: IEmployeeResponse) => {
    setSelectedData(data);
    setToggle(true);
  };
  const columnHelper = createColumnHelper<IEmployeeResponse>();

  const columns = [
    columnHelper.accessor((row) => row, {
      id: "name",
      cell: (info) => (
        <div className="flex gap-4">
          <div className="relative">
            <UserAvatar size="sm" user={info.row.original} />
            {info.row.original.emailVerified ? (
              <div className="absolute bottom-[-4px] right-[-4px] flex h-4 w-4 items-center justify-center rounded-full bg-transparent text-green-500">
                <Check color="green" />
              </div>
            ) : (
              <div className="absolute bottom-[-4px] right-[-4px] flex h-4 w-4 items-center justify-center rounded-full bg-transparent text-red-500">
                <X color="red" />
              </div>
            )}
          </div>
          <div>
            <span>{info.row.original.firstName}</span>
            <span>{info.row.original.lastName}</span>
          </div>
        </div>
      ),
      header: () => <span>Name</span>,
    }),
    columnHelper.accessor((row) => row.employeeId, {
      id: "employeeId",
      cell: (info) => <i>{info.renderValue()}</i>,
      header: () => <span>Employee Id</span>,
    }),
    columnHelper.accessor((row) => row.mobileNumber, {
      id: "mobileNumber",
      cell: (info) => <i>{info.renderValue()}</i>,
      header: () => <span>Mobile Number</span>,
    }),
    columnHelper.accessor((row) => row.role, {
      id: "role",
      cell: (info) => <i>{info.renderValue()}</i>,
      header: () => <span>Role</span>,
    }),

    columnHelper.accessor((row) => row, {
      id: "action",
      cell: (info) => (
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleEdit(info.row.original)}
            title="edit"
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold leading-5 text-neutral-800 hover:border-neutral-300 hover:text-neutral-950 active:border-neutral-200"
          >
            <ContactRound className="h-5 w-5 text-green-400" />
            <span>View</span>
          </button>
          <button
            onClick={() => handleEdit(info.row.original)}
            title="edit"
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold leading-5 text-neutral-800 hover:border-neutral-300 hover:text-neutral-950 active:border-neutral-200"
          >
            <SquarePen className="h-5 w-5 text-blue-400" />
            <span>Edit</span>
          </button>
        </div>
      ),
      header: () => <span>Action</span>,
    }),
  ];

  const handleSearch = () => {
    fetchAll({
      isPaginationEnabled: true,
      page: 1,
      pageSize: 10,
      keyword: keyword,
      isActive: isSprintActive,
    });
  };

  const handlePrevious = () => {
    if (
      !data?.data?.pagination?.currentPage ||
      data?.data?.pagination?.currentPage === 1
    )
      return;

    fetchAll({
      isPaginationEnabled: true,
      page: data?.data?.pagination?.currentPage - 1,
      pageSize: data?.data?.pagination?.pageSize,
      keyword: keyword,
      isActive: isSprintActive,
    });
  };

  const handleNext = () => {
    if (!data?.data?.pagination?.currentPage) return;

    fetchAll(
      {
        isPaginationEnabled: true,
        page: data?.data?.pagination?.currentPage + 1,
        pageSize: data?.data?.pagination?.pageSize,
        keyword: keyword,
        isActive: isSprintActive,
      },
      true,
    );
  };

  return (
    <div className="pt-18 container mx-auto bg-white px-4 lg:px-8 lg:pt-2 xl:max-w-7xl">
      <div className="flex items-center justify-between pb-4 pt-4 lg:pb-4">
        <Header title="Employee" />

        <div className="flex justify-end gap-4">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex gap-2 rounded-md border border-gray-200 p-1">
              <button
                onClick={() => setIsSprintActive(true)}
                className={
                  isSprintActive === true
                    ? "rounded bg-green-400 px-3 py-1 text-sm hover:bg-gray-200"
                    : "rounded bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
                }
              >
                Active
              </button>
              <button
                onClick={() => setIsSprintActive(false)}
                className={
                  isSprintActive === false
                    ? "rounded bg-red-400 px-3 py-1 text-sm hover:bg-gray-200"
                    : "rounded bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
                }
              >
                Inactive
              </button>
            </div>
            <SearchBar setKeyword={setKeyword} keyword={keyword} />
          </div>

          <button
            onClick={handleToggleModal}
            className="flex items-center rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
            <span>
              <SquarePlus className="mr-3 h-5 w-5" />
            </span>
            <span>Add New Employee</span>
          </button>
        </div>
      </div>
      <div>
        <div className="pb-5">
          <ReactTable
            isFetching={isFetching}
            showPagination
            columns={columns}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            data={data?.data.result ?? []}
            pagination={
              data?.data?.pagination ?? {
                currentPage: 1,
                pageSize: 10,
                totalCount: 10,
                totalPages: 1,
              }
            }
          />
        </div>
      </div>
      <Modal
        isOpen={toggle}
        size={2}
        onClose={() => setToggle(false)}
        modalTitleChildren={
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {selectedData?.id ? "Edit Employee" : "Add Employee"}
            </h2>
          </div>
        }
      >
        <EmployeeModal
          selectedData={selectedData}
          setSelectedData={setSelectedData}
          onClose={() => setToggle(false)}
        />
      </Modal>
    </div>
  );
};

export default EmployeeList;
