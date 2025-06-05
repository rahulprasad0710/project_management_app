import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Filter, Share2, SquarePen, Trash } from "lucide-react";
import React, { useState } from "react";

import { IProject } from "@/types/user.types";
import Modal from "./Modal";
import ProjectModal from "./ProjectModal";
import { Response } from "@/store/api";
import { format } from "date-fns";

type IProps = {
  projectListResponse: Response<IProject[]> | undefined;
};

function ProjectTableView(props: IProps) {
  const { projectListResponse } = props;

  const [selectedData, setSelectedData] = useState<undefined | IProject>();
  const [toggle, setToggle] = useState(false);

  const handleEdit = (data: IProject) => {
    setSelectedData(data);
    setToggle(true);
  };

  const columns: GridColDef<IProject>[] = [
    { field: "name", headerName: "Title", width: 300 },

    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="inline-flex rounded-full bg-green-100 px-2 text-sm font-semibold leading-5 text-green-800">
            {params.value}
          </div>
        );
      },
    },
    {
      field: "priority",
      headerName: "Priority",
      type: "string",
      width: 150,
    },
    {
      field: "startDate",
      headerName: "Start Date",
      sortable: true,
      width: 160,
      renderCell: (params) => {
        return (
          <div className="inline-flex rounded-full bg-blue-100 px-2 text-sm font-semibold leading-5 text-green-800">
            {format(params.value, "dd/MM/yyyy")}
          </div>
        );
      },
    },
    {
      field: "endDate",
      headerName: "End Date",
      sortable: true,
      width: 160,
      renderCell: (params) => {
        return (
          <div className="inline-flex rounded-full bg-red-100 px-2 text-sm font-semibold leading-5 text-green-800">
            {format(params.value, "dd/MM/yyyy")}
          </div>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      sortable: true,
      width: 160,
      renderCell: (params) => {
        return (
          <div className="flex items-center gap-4">
            <button
              title="edit"
              onClick={() => handleEdit(params.row)}
              className="mt-4 text-blue-500 hover:text-blue-600"
            >
              <SquarePen className="h-5 w-5" />
            </button>
            <button
              title="delete"
              className="mt-4 text-red-500 hover:text-red-600"
            >
              <Trash className="h-5 w-5" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="h-[540px] w-full px-4 pb-8 xl:px-6">
      <div className="pb-5">
        <DataGrid
          rows={projectListResponse?.data || []}
          className="bg-white shadow-sm"
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 20,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </div>
      <Modal
        modalTitle="Add new project"
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

export default ProjectTableView;
