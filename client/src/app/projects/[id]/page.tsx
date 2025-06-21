"use client";

import { Edit, SquarePlus } from "lucide-react";
import {
  IMultiList,
  IPriorityOptions,
  Priority,
  priorityOptions,
  statusOptions,
} from "@/types/user.types";
import React, { useState } from "react";
import {
  useGetLabelsQuery,
  useGetProjectByIdQuery,
  useGetUsersQuery,
} from "@/store/api";

import BoardView from "@/app/(components)/BoardView";
import Header from "@/app/(components)/Header";
import Modal from "@/app/(components)/Modal";
import MultiSelect2 from "@/app/(components)/atoms/MultiSelect2";
import MultiSelectUser from "@/app/(components)/atoms/MultiSelectUser";
import ProjectHeader from "@/app/(components)/ProjectHeader";
import SearchBar from "@/app/(components)/molecules/SearchBar";
import TableView from "@/app/(components)/TableView";
import TaskModal from "@/app/(components)/modals/TaskModal";
import TimelineView from "@/app/(components)/TimelineView";
import { useParams } from "next/navigation";

type BOARD_TYPES = "BOARD" | "LIST" | "CALENDAR" | "TIMELINE" | "TABLE";

const ProjectDetails = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<BOARD_TYPES>("BOARD");
  const [keyword, setKeyword] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<IMultiList[]>([]);
  const [selectedPriority, setSelectedPriority] = useState<IMultiList[]>([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const { data: labelList } = useGetLabelsQuery({
    isPaginationEnabled: false,
    page: 1,
    pageSize: 10,
    isActive: true,
  });
  const { data: projectResponse, isLoading } = useGetProjectByIdQuery({
    projectId: Number(id),
  });

  const { isFetching: isUserFetching, data: userList } = useGetUsersQuery();

  const [selectedTeamMember, setSelectedTeamMember] = useState<IMultiList[]>(
    [],
  );

  const statusList: IMultiList[] = labelList?.data?.result?.map((status) => {
    return {
      label: status.name as string,
      value: String(status.id) as string,
    };
  });

  const priorityList: IMultiList[] = priorityOptions.map((option) => {
    return {
      label: option.label as string,
      value: option.value as string,
    };
  });

  const handleClearFilter = () => {
    setKeyword("");
    setSelectedPriority([]);
    setSelectedStatus([]);
    // fetchAllProject({
    //   isPaginationEnabled: true,
    //   page: 1,
    //   pageSize: 10,
    //   keyword: keyword,
    //   status: selectedStatus.map((item) => item.value as ProjectStatus),
    //   priority: selectedPriority,
    // });
  };

  const handleSearch = () => {
    // fetchAllProject({
    //   isPaginationEnabled: true,
    //   page: 1,
    //   pageSize: 10,
    //   keyword: keyword,
    //   status: selectedStatus.map((item) => item.value as ProjectStatus),
    //   priority: selectedPriority,
    // });
  };

  const handleToggleProjectModal = () => {
    setIsTaskModalOpen(!isTaskModalOpen);
  };

  if (isLoading)
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  return (
    <div className="px-4 xl:px-6">
      <div className="flex items-center justify-between pb-4 pt-4 lg:pb-4">
        <div className="flex items-center gap-4">
          <Header title="Project" />
          <button>
            <Edit className="h-5 w-5" />
          </button>
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={handleToggleProjectModal}
            className="flex items-center rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
            <span>
              <SquarePlus className="mr-3 h-5 w-5" />
            </span>
            <span>Add new task</span>
          </button>
        </div>
      </div>
      <div className="my-4 flex flex-wrap items-center justify-between gap-4">
        <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex items-center justify-end gap-2 md:gap-4">
          <button
            type="button"
            onClick={handleClearFilter}
            className="focus:shadow-outline justify-start rounded bg-gray-100 px-4 py-1 font-bold text-gray-500 hover:text-gray-800"
          >
            Clear filter
          </button>
          <div>
            <MultiSelectUser
              placeholder="Assignee"
              list={
                !isUserFetching && userList?.data && userList?.data?.length > 0
                  ? userList?.data.map((item) => {
                      return {
                        label: `${item.firstName} ${item.lastName}`,
                        value: item.id,
                        icon: item.profilePictureUrl as string,
                      };
                    })
                  : []
              }
              selectedList={selectedTeamMember}
              setSelectList={setSelectedTeamMember}
            />
          </div>
          <div className="relative w-[200px]">
            <MultiSelect2
              list={statusList}
              size={1}
              placeholder="Labels"
              selectedList={selectedStatus}
              setSelectList={setSelectedStatus}
            />
          </div>
          <div className="relative w-[200px]">
            <MultiSelect2
              list={priorityList}
              size={1}
              placeholder="Priority"
              selectedList={selectedPriority}
              setSelectList={setSelectedPriority}
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
      </div>
      {activeTab === "TABLE" && <TableView projectResponse={projectResponse} />}
      {activeTab === "BOARD" && (
        <BoardView
          setIsTaskModalOpen={setIsTaskModalOpen}
          isTaskModalOpen={isTaskModalOpen}
          projectResponse={projectResponse}
        />
      )}
      {activeTab === "TIMELINE" && (
        <TimelineView projectResponse={projectResponse} />
      )}
      <Modal
        modalTitle="Add new task"
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      >
        <TaskModal onClose={() => setIsTaskModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default ProjectDetails;
