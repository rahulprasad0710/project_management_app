import type {
    IEmployeeResponse,
    ILabelResponse,
    IMultiList,
    IPriorityOptions,
} from "@/types/config.types";
import { useAppDispatch, useAppSelector } from "@/store/reduxHook";
import { useEffect, useState } from "react";

import Button from "@/components/ui/button/Button";
import KanbanTask from "@/components/task/KanbanTask";
import { Modal } from "@/components/common/Modal";
import MultiSelect2 from "@components/atoms/MultiSelect2";
import MultiSelectUser from "@components/atoms/MultiSelectUser";
import { PlusIcon } from "lucide-react";
import SearchBar from "@/components/molecules/SearchBar";
import TaskModal from "@/components/settings/TaskModal";
import { priorityOptions } from "@/types/config.types";
import { setRefetchProjectTaskList } from "@/store/index";
import { toast } from "react-toastify";
import { useGetEmployeesQuery } from "@apiHooks/useEmployee";
import { useGetLabelsQuery } from "@apiHooks/useLabel";
import { useGetQueryParams } from "@hooks/useGetQueryParams";
import { useLazyGetTasksQuery } from "@apiHooks/useTask";
import { useParams } from "react-router-dom";

type BOARD_TYPES = "BOARD" | "LIST" | "CALENDAR" | "TIMELINE" | "TABLE";

const TaskPage = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const isDataRefetchList = useAppSelector(
        (state) => state.global.isDataRefetchList
    );

    const { data: labelList, isFetching: isLabelFetching } = useGetLabelsQuery({
        isPaginationEnabled: false,
        page: 1,
        pageSize: 10,
        isActive: true,
    });

    const { isFetching: isUserFetching, data: userList } = useGetEmployeesQuery(
        {
            isPaginationEnabled: false,
            page: 1,
            pageSize: 10,
            isActive: true,
        }
    );

    const [keyword, setKeyword] = useState<string>("");
    const [selectedLabels, setSelectedLabels] = useState<IMultiList[]>([]);
    const [selectedLabelsIds, setSelectedLabelsIds] = useState<string[]>([]);
    const [selectedPriorityIds, setSelectedPriorityIds] = useState<string[]>(
        []
    );
    const [selectedPriority, setSelectedPriority] = useState<IMultiList[]>([]);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
    const [selectedAssigneeIds, setSelectedAssigneeIds] = useState<string[]>(
        []
    );
    const [selectedTeamMember, setSelectedTeamMember] = useState<IMultiList[]>(
        []
    );

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
    });

    const isPriorityUrlValueSet = useGetQueryParams<IPriorityOptions>({
        urlDataName: "priority",
        dataToFetchDataFrom: priorityOptions,
        setSelectedIds: setSelectedPriorityIds,
        selectedIds: selectedPriorityIds,
        setMultiSelectList: setSelectedPriority,
        labelKey: "label",
        isDataLoading: isLabelFetching,
    });

    const isAssigneeUrlValueSet = useGetQueryParams<IEmployeeResponse>({
        urlDataName: "assignee",
        dataToFetchDataFrom: userList?.data?.result,
        setSelectedIds: setSelectedAssigneeIds,
        selectedIds: selectedAssigneeIds,
        setMultiSelectList: setSelectedTeamMember,
        labelKey: "firstName",
        isDataLoading: isLabelFetching,
    });

    console.log({
        selectedAssigneeIds,
    });

    const [fetchProjectTasksByProjectId, { data: projectTasks, isError }] =
        useLazyGetTasksQuery();

    const handleFetchData = () => {
        fetchProjectTasksByProjectId({
            isPaginationEnabled: false,
            page: 1,
            pageSize: 10,
            keyword: keyword,
            labels: selectedLabelsIds,
            priority: selectedPriorityIds,
            assignedTo: selectedAssigneeIds,
            featureId: 1,
        });
    };

    useEffect(() => {
        if (isError) {
            toast.error("Something Went Wrong!");
        }
    }, [isError]);

    useEffect(() => {
        if (
            isLabelUrlValueSet &&
            isPriorityUrlValueSet &&
            isAssigneeUrlValueSet
        ) {
            handleFetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLabelUrlValueSet, isPriorityUrlValueSet, isAssigneeUrlValueSet, id]);

    useEffect(() => {
        console.log({
            isDataRefetchList,
        });
        if (isDataRefetchList) {
            handleFetchData();
            dispatch(setRefetchProjectTaskList(false));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDataRefetchList]);

    const handleClearFilter = () => {
        setKeyword("");
        setSelectedPriority([]);
        setSelectedLabels([]);
        setSelectedTeamMember([]);
    };

    const handleSearch = () => {
        handleFetchData();
    };

    const handleToggleModal = () => {
        setIsTaskModalOpen(!isTaskModalOpen);
    };

    useEffect(() => {
        if (
            isLabelUrlValueSet &&
            isPriorityUrlValueSet &&
            isAssigneeUrlValueSet
        ) {
            handleFetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedLabelsIds, selectedPriorityIds, selectedAssigneeIds]);
    return (
        <div className='rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]'>
            <div className='flex flex-col justify-between gap-5 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center dark:border-gray-800'>
                <div>
                    <h3 className='text-lg font-semibold text-gray-800 dark:text-white/90'>
                        Booking Task
                    </h3>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                        Track your task progress of booking service.
                    </p>
                </div>
                <div>
                    <Button
                        onClick={handleToggleModal}
                        variant='primary'
                        size='sm'
                    >
                        <PlusIcon size={16} />
                        Add Task
                    </Button>
                </div>
            </div>
            <div className='border-b border-gray-200 px-5 py-4 dark:border-gray-800'>
                <div className='flex items-center justify-end gap-2 md:gap-4'>
                    <button
                        type='button'
                        onClick={handleClearFilter}
                        className='focus:shadow-outline justify-start rounded bg-transparent px-4 py-1 font-bold text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                    >
                        Clear filter
                    </button>

                    <div>
                        <MultiSelectUser
                            selectedIds={selectedAssigneeIds}
                            setSelectedIds={setSelectedAssigneeIds}
                            placeholder='Assignee'
                            list={
                                !isUserFetching &&
                                userList?.data &&
                                userList?.data?.result?.length > 0
                                    ? userList?.data.result?.map((item) => {
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
                    <div className='relative w-[200px]'>
                        <MultiSelect2
                            list={statusList || []}
                            size={1}
                            setSelectIds={setSelectedLabelsIds}
                            selectedIds={selectedLabelsIds}
                            placeholder='Labels'
                            selectedList={selectedLabels}
                            setSelectList={setSelectedLabels}
                        />
                    </div>
                    <div className='relative w-[200px]'>
                        <MultiSelect2
                            list={priorityList}
                            size={1}
                            setSelectIds={setSelectedPriorityIds}
                            selectedIds={selectedPriorityIds}
                            placeholder='Priority'
                            selectedList={selectedPriority}
                            setSelectList={setSelectedPriority}
                        />
                    </div>
                    <SearchBar setKeyword={setKeyword} keyword={keyword} />

                    <button
                        type='button'
                        onClick={handleSearch}
                        className='rounded bg-blue-500 px-4 py-1 font-bold text-white hover:bg-blue-600'
                    >
                        Search
                    </button>
                </div>
                <KanbanTask
                    isTaskModalOpen={isTaskModalOpen}
                    setIsTaskModalOpen={setIsTaskModalOpen}
                    projectTasks={projectTasks}
                />
            </div>
            <Modal
                className='max-w-[900px] mb-4  '
                isFullscreen={false}
                isOpen={isTaskModalOpen}
                onClose={handleToggleModal}
                showCloseButton={true}
            >
                <TaskModal onClose={handleToggleModal} />
            </Modal>
        </div>
    );
};

export default TaskPage;
