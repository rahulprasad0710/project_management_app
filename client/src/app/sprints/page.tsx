"use client";

import React, { useState } from "react";

import Header from "@/app/(components)/Header";
import { ISprintResponse } from "@/types/user.types";
import Modal from "@/app/(components)/Modal";
import ProjectHeader from "@/app/(components)/ProjectHeader";
import SearchBar from "@/app/(components)/molecules/SearchBar";
import SprintCard from "../(components)/SprintCard";
import SprintModal from "@/app/(components)/modals/SprintModal";
import { SquarePlus } from "lucide-react";
import { useGetSprintsQuery } from "@/store/api";

type BOARD_TYPES = "BOARD" | "LIST" | "CALENDAR" | "TIMELINE" | "TABLE";

const Sprint = () => {
  const [isSprintActive, setIsSprintActive] = useState<boolean>(true);

  const { data: sprintList, isFetching } = useGetSprintsQuery({
    isPaginationEnabled: true,
    page: 1,
    pageSize: 10,
    isActive: isSprintActive,
  });
  const [toggle, setToggle] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<
    undefined | ISprintResponse
  >();
  const [activeTab, setActiveTab] = useState<BOARD_TYPES>("BOARD");
  const [keyword, setKeyword] = useState<string>("");

  const handleToggleModal = () => {
    setToggle(!toggle);
  };

  const handleEditSprint = (data: ISprintResponse) => {
    setSelectedData(data);
    setToggle(true);
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 lg:pt-2 xl:max-w-7xl">
      <div className="flex items-center justify-between pb-4 pt-4 lg:pb-4">
        <Header title="Sprints" />
        <div className="mt-2 flex gap-2 rounded-md border border-gray-200 p-1">
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
        <div className="flex justify-end gap-4">
          <div className="flex items-center gap-2 md:gap-4">
            <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab} />
            <SearchBar setKeyword={setKeyword} keyword={keyword} />
          </div>

          <button
            onClick={handleToggleModal}
            className="flex items-center rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
            <span>
              <SquarePlus className="mr-3 h-5 w-5" />
            </span>
            <span>Add new sprint</span>
          </button>
        </div>
      </div>
      <div>
        <div className="mt-6 flex flex-wrap items-center gap-6">
          {sprintList?.data.result.map((item: ISprintResponse) => {
            return (
              <SprintCard
                handleEditSprint={handleEditSprint}
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

export default Sprint;
