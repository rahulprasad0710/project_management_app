"use client";
// PAGE_PROJECT_LIST

import type {
    IMultiList,
    IPriorityOptions,
    IProject,
    IProjectStatusOptions,
    ProjectStatus,
} from "@/types/config.types";
import { priorityOptions, projectStatusOptions } from "@/types/config.types";
import { useEffect, useState } from "react";

import Button from "@/components/ui/button/Button";
import MultiSelect2 from "@components/atoms/MultiSelect2";
import { PlusIcon } from "lucide-react";
import ProjectTable from "@/components/ProjectTable";
import SearchBar from "@/components/molecules/SearchBar";
import { useGetQueryParams } from "@/hooks/useGetQueryParams";
import { useLazyGetProjectsQuery } from "@apiHooks/useProject";

const ProjectPage = () => {
    const [fetchAllProject, { isFetching, data }] = useLazyGetProjectsQuery();
    const [toggle, setToggle] = useState(false);
    const [selectedData, setSelectedData] = useState<undefined | IProject>();
    const [keyword, setKeyword] = useState<string>("");
    const [selectedStatus, setSelectedStatus] = useState<IMultiList[]>([]);
    const [selectedStatusIds, setSelectedStatusIds] = useState<string[]>([]);
    const [selectedPriorityIds, setSelectedPriorityIds] = useState<string[]>(
        []
    );

    const priorityList: IMultiList[] = priorityOptions.map((option) => {
        return {
            label: option.label as string,
            value: option.value as string,
        };
    });

    const [selectedPriority, setSelectedPriority] = useState<IMultiList[]>([]);

    const statusList = projectStatusOptions?.map(
        (status: IProjectStatusOptions) => {
            return {
                label: status.label,
                value: String(status.value),
            };
        }
    );

    const isStatusUrlValueSet = useGetQueryParams<IProjectStatusOptions>({
        urlDataName: "Status",
        dataToFetchDataFrom: projectStatusOptions,
        setSelectedIds: setSelectedStatusIds,
        selectedIds: selectedStatusIds,
        setMultiSelectList: setSelectedStatus,
        labelKey: "name",
        isDataLoading: false,
    });

    const isPriorityUrlValueSet = useGetQueryParams<IPriorityOptions>({
        urlDataName: "priority",
        dataToFetchDataFrom: priorityOptions,
        setSelectedIds: setSelectedPriorityIds,
        selectedIds: selectedPriorityIds,
        setMultiSelectList: setSelectedPriority,
        labelKey: "label",
        isDataLoading: false,
    });

    console.log({
        isStatusUrlValueSet,
        isPriorityUrlValueSet,
        selectedPriorityIds,
        selectedStatusIds,
    });

    useEffect(() => {
        if (isStatusUrlValueSet && isPriorityUrlValueSet) {
            fetchAllProject({
                isPaginationEnabled: true,
                page: 1,
                pageSize: 10,
                priority: selectedPriorityIds,
                status: selectedStatusIds,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchAllProject, isPriorityUrlValueSet, isStatusUrlValueSet]);

    const handleSearch = () => {
        fetchAllProject({
            isPaginationEnabled: true,
            page: 1,
            pageSize: 10,
            keyword: keyword,
            status: selectedStatus.map((item) => item.value as ProjectStatus),
            priority: selectedPriority.map((item) => item.value as string),
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
            true
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

    return (
        <div className='rounded-md border border-gray-200 bg-white dark:border-gray-800 dark:bg-slate-800'>
            <div className='flex flex-col justify-end md:justify-between gap-5 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center dark:border-gray-800'>
                <div>
                    <h3 className='text-lg font-semibold text-gray-800 dark:text-white/90'>
                        Events
                    </h3>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                        View Event list.
                    </p>
                </div>
                <Button variant='primary' size='sm'>
                    <PlusIcon size={16} />
                    Add New Event
                </Button>
            </div>

            <div className='border-t border-gray-100 bg-white p-4 dark:border-gray-800 flex flex-wrap items-center justify-end gap-4 '>
                <button
                    type='button'
                    onClick={handleClearFilter}
                    className='focus:shadow-outline justify-start rounded bg-gray-100 px-4 py-1 font-bold text-gray-500 hover:text-gray-800'
                >
                    Clear filter
                </button>

                <div className='relative w-[200px]'>
                    <MultiSelect2
                        list={statusList}
                        size={1}
                        setSelectIds={setSelectedStatusIds}
                        selectedIds={selectedStatusIds}
                        placeholder='Status'
                        selectedList={selectedStatus}
                        setSelectList={setSelectedStatus}
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
                <Button size='xs' type='button' onClick={handleSearch}>
                    Search
                </Button>
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
            {/* <Modal
                modalTitleChildren={
                    <div className='flex items-center pl-2'>
                        {selectedData?.id ? (
                            <FolderPen className='mr-2 h-5 w-5 text-gray-800' />
                        ) : (
                            <FolderPlus className='mr-2 h-5 w-5 text-gray-800' />
                        )}{" "}
                        <span className='font-semibold text-gray-800'>
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
            </Modal> */}
        </div>
    );
};

export default ProjectPage;
