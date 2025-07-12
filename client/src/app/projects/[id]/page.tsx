"use client";

// PAGE_TASK_LIST
import { Edit, SquarePlus } from "lucide-react";
import {
  ILabelResponse,
  IMultiList,
  IPriorityOptions,
  IUser,
  priorityOptions,
} from "@/types/user.types";
import React, { useEffect, useState } from "react";
import {
  useGetLabelsQuery,
  useGetUsersQuery,
  useLazyGetProjectTaskByProjectIdQuery,
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
import { useGetQueryParams } from "@/app/utils/urlSearchParamsFn";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

type BOARD_TYPES = "BOARD" | "LIST" | "CALENDAR" | "TIMELINE" | "TABLE";

const ProjectDetails = () => {
  const { id } = useParams();
  const router = useRouter();

  const { data: labelList, isFetching: isLabelFetching } = useGetLabelsQuery({
    isPaginationEnabled: false,
    page: 1,
    pageSize: 10,
    isActive: true,
  });

  const { isFetching: isUserFetching, data: userList } = useGetUsersQuery();

  const [activeTab, setActiveTab] = useState<BOARD_TYPES>("BOARD");
  const [keyword, setKeyword] = useState<string>("");
  const [selectedLabels, setSelectedLabels] = useState<IMultiList[]>([]);
  const [selectedLabelsIds, setSelectedLabelsIds] = useState<string[]>([]);
  const [selectedPriorityIds, setSelectedPriorityIds] = useState<string[]>([]);
  const [selectedPriority, setSelectedPriority] = useState<IMultiList[]>([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [selectedAssigneeIds, setSelectedAssigneeIds] = useState<string[]>([]);
  const [selectedTeamMember, setSelectedTeamMember] = useState<IMultiList[]>(
    [],
  );

  const [refetchList, setRefetchList] = useState<boolean>(false);

  const statusList = labelList?.data?.result?.map((status) => {
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

  const isLabelUrlValueSet = useGetQueryParams<ILabelResponse>({
    urlDataName: "labels",
    dataToFetchDataFrom: labelList?.data?.result,
    setSelectedIds: setSelectedLabelsIds,
    selectedIds: selectedLabelsIds,
    setMultiSelectList: setSelectedLabels,
    labelKey: "name",
    isDataLoading: isLabelFetching,
    router,
  });

  const isPriorityUrlValueSet = useGetQueryParams<IPriorityOptions>({
    urlDataName: "priority",
    dataToFetchDataFrom: priorityOptions,
    setSelectedIds: setSelectedPriorityIds,
    selectedIds: selectedPriorityIds,
    setMultiSelectList: setSelectedPriority,
    labelKey: "label",
    isDataLoading: isLabelFetching,
    router,
  });

  const isAssigneeUrlValueSet = useGetQueryParams<IUser>({
    urlDataName: "assignee",
    dataToFetchDataFrom: userList?.data,
    setSelectedIds: setSelectedAssigneeIds,
    selectedIds: selectedAssigneeIds,
    setMultiSelectList: setSelectedTeamMember,
    labelKey: "firstName",
    isDataLoading: isLabelFetching,
    router,
  });

  console.log({
    selectedAssigneeIds,
  });

  const [fetchProjectTasksByProjectId, { data: projectTasks }] =
    useLazyGetProjectTaskByProjectIdQuery();

  const handleFetchData = () => {
    fetchProjectTasksByProjectId({
      projectId: Number(id),
      isPaginationEnabled: false,
      page: 1,
      pageSize: 10,
      keyword: keyword,
      labels: selectedLabelsIds,
      priority: selectedPriorityIds,
      assignedTo: selectedAssigneeIds,
    });
  };

  useEffect(() => {
    if (isLabelUrlValueSet && isPriorityUrlValueSet && isAssigneeUrlValueSet) {
      handleFetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLabelUrlValueSet, isPriorityUrlValueSet, isAssigneeUrlValueSet, id]);

  useEffect(() => {
    console.log({
      refetchList,
    });
    if (refetchList) {
      handleFetchData();
      setRefetchList(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetchList]);

  const handleClearFilter = () => {
    setKeyword("");
    setSelectedPriority([]);
    setSelectedLabels([]);
    setSelectedTeamMember([]);
  };

  const handleSearch = () => {
    handleFetchData();
  };

  const handleToggleProjectModal = () => {
    setIsTaskModalOpen(!isTaskModalOpen);
  };

  useEffect(() => {
    if (isLabelUrlValueSet && isPriorityUrlValueSet && isAssigneeUrlValueSet) {
      handleFetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLabelsIds, selectedPriorityIds, selectedAssigneeIds]);

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
            className="focus:shadow-outline justify-start rounded bg-transparent px-4 py-1 font-bold text-gray-500 hover:bg-gray-100 hover:text-gray-800"
          >
            Clear filter
          </button>

          <div>
            <MultiSelectUser
              selectedIds={selectedAssigneeIds}
              setSelectedIds={setSelectedAssigneeIds}
              placeholder="Assignee"
              list={
                !isUserFetching && userList?.data && userList?.data?.length > 0
                  ? userList?.data.map((item) => {
                      return {
                        label: `${item.firstName} ${item.lastName}`,
                        value: String(item.id),
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
              list={statusList || []}
              size={1}
              setSelectIds={setSelectedLabelsIds}
              selectedIds={selectedLabelsIds}
              placeholder="Labels"
              selectedList={selectedLabels}
              setSelectList={setSelectedLabels}
            />
          </div>
          <div className="relative w-[200px]">
            <MultiSelect2
              list={priorityList}
              size={1}
              setSelectIds={setSelectedPriorityIds}
              selectedIds={selectedPriorityIds}
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
      {activeTab === "TABLE" && <TableView projectResponse={projectTasks} />}
      {activeTab === "BOARD" && (
        <BoardView
          setIsTaskModalOpen={setIsTaskModalOpen}
          isTaskModalOpen={isTaskModalOpen}
          projectTasks={projectTasks}
          setRefetchProjectTaskList={setRefetchList}
        />
      )}
      {activeTab === "TIMELINE" && (
        <TimelineView projectResponse={projectTasks} />
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
