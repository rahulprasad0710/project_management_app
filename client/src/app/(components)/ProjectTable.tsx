import { Filter, Share2, SquarePen, Trash } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

import { IProject } from "@/types/user.types";
import Modal from "./Modal";
import ProjectModal from "./ProjectModal";
import ReactTable from "./ReactTable";
import { createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";
import { useLazyGetProjectsQuery } from "@/store/api";
import { useRouter } from "next/navigation";

type IProps = {
  keyword: string;
};

function ProjectTable(props: IProps) {
  const { keyword } = props;
  const router = useRouter();

  useEffect(() => {
    fetchAllProject({
      isPaginationEnabled: true,
      page: 1,
      pageSize: 10,
    });
  }, []);

  const [selectedData, setSelectedData] = useState<undefined | IProject>();
  const [toggle, setToggle] = useState(false);
  const [fetchAllProject, { isFetching, data }] = useLazyGetProjectsQuery();

  const handleEdit = (data: IProject) => {
    setSelectedData(data);
    setToggle(true);
  };

  const handleNavigate = (data: IProject) => {
    setSelectedData(data);
    setToggle(true);
    // Navigate to the project details page
    // For example, using react-router:
    router.push(`/projects/${data.id}`);
  };

  const columnHelper = createColumnHelper<IProject>();

  const columns = [
    columnHelper.accessor((row) => row.name, {
      id: "name",
      cell: (info) => <i>{info.renderValue()}</i>,
      header: () => <span>Title</span>,
    }),
    columnHelper.accessor((row) => row.status, {
      id: "Status",
      cell: (info) => (
        <div className="inline-flex rounded-full bg-green-100 px-2 text-sm font-semibold leading-5 text-green-800">
          {info.renderValue()}
        </div>
      ),
      header: () => <span>Status</span>,
    }),
    columnHelper.accessor((row) => row.startDate, {
      id: "startDate",
      cell: (info) => (
        <div className="inline-block whitespace-nowrap rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold leading-4 text-blue-800">
          {format(info.getValue(), "dd/MM/yyyy")}
        </div>
      ),
      header: () => <span>Start Date</span>,
    }),
    columnHelper.accessor((row) => row.endDate, {
      id: "endDate",
      cell: (info) => (
        <div className="inline-block whitespace-nowrap rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold leading-4 text-blue-800">
          {format(info.getValue(), "dd/MM/yyyy")}
        </div>
      ),
      header: () => <span>End Date</span>,
    }),

    columnHelper.accessor((row) => row.priority, {
      id: "priority",
      cell: (info) => (
        <div className="inline-flex rounded-full bg-green-100 px-2 text-sm font-semibold leading-5 text-green-800">
          {info.renderValue()}
        </div>
      ),
      header: () => <span>Priority</span>,
    }),

    columnHelper.accessor((row) => row.startDate, {
      id: "action",
      cell: (info) => (
        <div className="flex items-center gap-4">
          <button
            title="edit"
            onClick={() => handleEdit(info.row.original)}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold leading-5 text-neutral-800 hover:border-neutral-300 hover:text-neutral-950 active:border-neutral-200"
          >
            <span>Edit</span>
            <SquarePen className="h-5 w-5 text-blue-400" />
          </button>

          <button
            title="View details"
            onClick={() => handleNavigate(info.row.original)}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold leading-5 text-neutral-800 hover:border-neutral-300 hover:text-neutral-950 active:border-neutral-200"
          >
            <span>View</span>
            <svg
              className="hi-mini hi-arrow-right inline-block size-5 text-teal-400 group-hover:text-blue-600 group-active:translate-x-0.5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
      ),
      header: () => <span>Action</span>,
    }),
  ];

  console.log({
    projectListResponse: data?.data,
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
    <div>
      <div className="pb-5">
        <ReactTable
          isFetching={isFetching}
          showPagination
          columns={columns}
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          data={data?.data.result ?? []}
          pagination={data?.data.pagination}
        />
      </div>
      <Modal
        modalTitle={selectedData ? "Edit new project" : "Add new project"}
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
}

export default ProjectTable;
