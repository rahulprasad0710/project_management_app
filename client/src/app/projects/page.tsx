"use client";
// PAGE_PROJECT_LIST

import { FolderPen, FolderPlus, SquarePlus } from "lucide-react";
import {
  IMultiList,
  IProject,
  ProjectStatus,
  priorityOptions,
  statusOptions,
} from "@/types/user.types";
import React, { useEffect, useState } from "react";

import Header from "../(components)/Header";
import Modal from "../(components)/Modal";
import MultiSelect2 from "../(components)/atoms/MultiSelect2";
import ProjectHeader from "../(components)/ProjectHeader";
import ProjectModal from "../(components)/ProjectModal";
import ProjectTable from "../(components)/ProjectTable";
import SearchBar from "../(components)/molecules/SearchBar";
import { useLazyGetProjectsQuery } from "@/store/api";
import { useRouter } from "next/navigation";

type BOARD_TYPES = "BOARD" | "LIST" | "CALENDAR" | "TIMELINE" | "TABLE";

const ProjectPage = () => {
  const [fetchAllProject, { isFetching, data }] = useLazyGetProjectsQuery();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<BOARD_TYPES>("TABLE");
  const [toggle, setToggle] = useState(false);
  const [keyword, setKeyword] = useState<string>("");
  const [selectedData, setSelectedData] = useState<undefined | IProject>();
  const [selectedStatus, setSelectedStatus] = useState<IMultiList[]>([]);

  const priorityList: IMultiList[] = priorityOptions.map((option) => {
    return {
      label: option.label as string,
      value: option.value as string,
    };
  });
  const [selectedPriority, setSelectedPriority] = useState<IMultiList[]>([]);

  const statusList: IMultiList[] = statusOptions.map((status) => {
    return {
      label: status.label as string,
      value: status.value as string,
    };
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

  const handleClearFilter = () => {
    if (!data?.data?.pagination?.currentPage) return;

    setKeyword("");
    setSelectedPriority([]);
    setSelectedStatus([]);
    fetchAllProject({
      isPaginationEnabled: true,
      page: 1,
      pageSize: 10,
    });
  };

  const handleNavigate = () => {
    router.push("/projects/add");
  };

  return (
    <div className="container mx-auto mt-6 bg-white px-4 lg:px-8 lg:pt-2 xl:max-w-7xl">
      <div className="my-4 flex items-center justify-between">
        <Header title="Project" />

        <div className="flex flex-wrap justify-end gap-4">
          <div className="flex items-center gap-2 md:gap-4">
            <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          <button
            onClick={() => handleNavigate()}
            className="flex min-w-[200px] items-center rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
            <span>
              <SquarePlus className="mr-3 h-5 w-5" />
            </span>
            <span>Add new project</span>
          </button>
        </div>
      </div>

      <div className="my-6 flex flex-wrap items-center justify-between gap-4 md:justify-between">
        <button
          type="button"
          onClick={handleClearFilter}
          className="focus:shadow-outline justify-start rounded bg-gray-100 px-4 py-1 font-bold text-gray-500 hover:text-gray-800"
        >
          Clear filter
        </button>

        <div className="relative w-[300px]">
          <MultiSelect2
            list={priorityList}
            size={1}
            placeholder="Priority"
            selectedList={selectedPriority}
            setSelectList={setSelectedPriority}
          />
        </div>

        <div className="relative w-[300px]">
          {/* <MultiSelect
            list={statusList}
            size={1}
            placeholder="Select status"
            selectedList={selectedStatus}
            setSelectList={setSelectedStatus}
          /> */}
          <MultiSelect2
            list={statusList}
            size={1}
            placeholder="Status"
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
