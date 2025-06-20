"use client";

import { FolderPen, FolderPlus, SquarePlus } from "lucide-react";
import {
  IMultiList,
  IPriorityOptions,
  IProject,
  Priority,
  ProjectStatus,
  priorityOptions,
  statusOptions,
} from "@/types/user.types";
import React, { useEffect, useState } from "react";

import Header from "../(components)/Header";
import Modal from "../(components)/Modal";
import MultiSelect from "../(components)/atoms/MultiSelect";
import ProjectHeader from "../(components)/ProjectHeader";
import ProjectModal from "../(components)/ProjectModal";
import ProjectTable from "../(components)/ProjectTable";
import SearchBar from "../(components)/molecules/SearchBar";
import { useLazyGetProjectsQuery } from "@/store/api";

type BOARD_TYPES = "BOARD" | "LIST" | "CALENDAR" | "TIMELINE" | "TABLE";

const ProjectPage = () => {
  const [fetchAllProject, { isFetching, data }] = useLazyGetProjectsQuery();

  const [activeTab, setActiveTab] = useState<BOARD_TYPES>("TABLE");
  const [toggle, setToggle] = useState(false);
  const [keyword, setKeyword] = useState<string>("");
  const [selectedData, setSelectedData] = useState<undefined | IProject>();
  const [selectedStatus, setSelectedStatus] = useState<IMultiList[]>([]);
  const [selectedPriority, setSelectedPriority] = useState<
    Priority | undefined
  >(undefined);

  console.log({
    selectedPriority,
  });

  useEffect(() => {
    fetchAllProject({
      isPaginationEnabled: true,
      page: 1,
      pageSize: 10,
    });
  }, [fetchAllProject]);

  const handleSearch = () => {
    fetchAllProject({
      isPaginationEnabled: true,
      page: 1,
      pageSize: 10,
      keyword: keyword,
      status: selectedStatus.map((item) => item.value as ProjectStatus),
      priority: selectedPriority,
    });
  };

  const handleToggleModal = () => {
    setSelectedData(undefined);
    setToggle(!toggle);
  };

  const statusList: IMultiList[] = statusOptions.map((status) => {
    return {
      label: status.label as string,
      value: status.value as string,
    };
  });

  const handlePrevious = () => {
    if (
      !data?.data?.pagination?.currentPage ||
      data?.data?.pagination?.currentPage === 1
    )
      return;

    fetchAllProject({
      isPaginationEnabled: true,
      page: data?.data?.pagination?.currentPage - 1,
      pageSize: data?.data?.pagination?.pageSize,
      keyword: keyword,
    });
  };

  const handleNext = () => {
    if (!data?.data?.pagination?.currentPage) return;

    fetchAllProject(
      {
        isPaginationEnabled: true,
        page: data?.data?.pagination?.currentPage + 1,
        pageSize: data?.data?.pagination?.pageSize,
        keyword: keyword,
      },
      true,
    );
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 lg:pt-2 xl:max-w-7xl">
      <div className="my-4 flex items-center justify-between">
        <Header title="Project" />

        <div className="flex flex-wrap justify-end gap-4">
          <div className="flex items-center gap-2 md:gap-4">
            <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          <button
            onClick={handleToggleModal}
            className="flex min-w-[200px] items-center rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
            <span>
              <SquarePlus className="mr-3 h-5 w-5" />
            </span>
            <span>Add new project</span>
          </button>
        </div>
      </div>
      <div className="my-6 flex flex-wrap items-center justify-center gap-4 md:justify-end">
        <div className="relative w-[300px]">
          <select
            onChange={(e) => setSelectedPriority(e.target.value as Priority)}
            className="block w-full appearance-none rounded border border-gray-200 bg-white px-4 py-1 pr-8 text-gray-700 focus:border-blue-300 focus:bg-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value={undefined}>All</option>
            {priorityOptions.map((priority: IPriorityOptions) => (
              <option value={priority.value} key={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="h-4 w-4 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>

        <div className="relative w-[300px]">
          <MultiSelect
            list={statusList}
            size={1}
            placeholder="Select status"
            selectedList={selectedStatus}
            setSelectList={setSelectedStatus}
          />
        </div>
        <SearchBar setKeyword={setKeyword} keyword={keyword} />
        <button
          type="button"
          onClick={handleSearch}
          className="rounded bg-blue-500 px-4 py-1 font-bold text-white hover:bg-blue-600"
        >
          Search
        </button>
      </div>
      <ProjectTable
        setSelectedData={setSelectedData}
        toggle={toggle}
        setToggle={setToggle}
        handleNext={handleNext}
        handlePrevious={handlePrevious}
        isFetching={isFetching}
        data={data}
      />
      <Modal
        modalTitleChildren={
          <div className="flex items-center pl-2">
            {selectedData?.id ? (
              <FolderPen className="mr-2 h-5 w-5 text-gray-800" />
            ) : (
              <FolderPlus className="mr-2 h-5 w-5 text-gray-800" />
            )}{" "}
            <span className="font-semibold text-gray-800">
              {selectedData?.id ? "Edit" : "Add"} new project
            </span>
          </div>
        }
        isOpen={toggle}
        onClose={() => setToggle(false)}
      >
        <ProjectModal
          selectedData={selectedData}
          setSelectedData={setSelectedData}
          onClose={() => setToggle(false)}
        />
      </Modal>
    </div>
  );
};

export default ProjectPage;
