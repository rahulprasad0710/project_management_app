"use client";

import { IInternalCompanyResponse, ISprintResponse } from "@/types/user.types";
import React, { useState } from "react";

import Header from "@/app/(components)/Header";
import InternalCompanyCard from "../(components)/InternalCompanyCard";
import Modal from "@/app/(components)/Modal";
import ProjectHeader from "@/app/(components)/ProjectHeader";
import SearchBar from "@/app/(components)/molecules/SearchBar";
import SprintCard from "../(components)/SprintCard";
import SprintModal from "@/app/(components)/modals/SprintModal";
import { SquarePlus } from "lucide-react";
import { useGetInternalCompaniesQuery } from "@/store/api";

const InternalCompanyList = () => {
  const { data: internalCompanyList, isFetching } =
    useGetInternalCompaniesQuery({
      isPaginationEnabled: true,
      page: 1,
      pageSize: 5,
      isActive: true,
    });
  const [toggle, setToggle] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<
    undefined | IInternalCompanyResponse
  >();

  const handleToggleModal = () => {
    setToggle(!toggle);
  };

  const handleEditSprint = (data: IInternalCompanyResponse) => {
    setSelectedData(data);
    setToggle(true);
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 lg:pt-2 xl:max-w-7xl">
      <div className="flex items-center justify-between pb-4 pt-4 lg:pb-4">
        <Header title="Internal Company" />

        <div className="flex justify-end gap-4">
          <button
            onClick={handleToggleModal}
            className="flex items-center rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
            <span>
              <SquarePlus className="mr-3 h-5 w-5" />
            </span>
            <span>Add Internal Company</span>
          </button>
        </div>
      </div>
      <div>
        <div className="mt-6 flex flex-wrap items-center gap-6">
          {internalCompanyList?.data.map((item: IInternalCompanyResponse) => {
            return (
              <InternalCompanyCard
                handleEdit={handleEditSprint}
                key={item.id}
                data={item}
              />
            );
          })}
        </div>
      </div>
      <Modal
        isOpen={toggle}
        size={2}
        onClose={() => setToggle(false)}
        modalTitleChildren={
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {selectedData?.id ? "Edit Sprint" : "Add Sprint"}
            </h2>
          </div>
        }
      >
        <SprintModal
          selectedData={selectedData}
          setSelectedData={setSelectedData}
          onClose={() => setToggle(false)}
        />
      </Modal>
    </div>
  );
};

export default InternalCompanyList;
