import React from "react";
import { Response } from "@/store/api";
import { IProject, ITask } from "@/types/user.types";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { format } from "date-fns";

type IProps = {
  projectResponse: Response<IProject> | undefined;
};

function TableView(props: IProps) {
  const { projectResponse } = props;

  const columns: GridColDef<ITask>[] = [
    { field: "title", headerName: "Title", width: 100 },
    {
      field: "description",
      headerName: "Description",
      width: 250,
    },
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
      width: 110,
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
      field: "addedBy",
      headerName: "Added By",
      sortable: true,
      width: 160,
      valueGetter: (value, row) => `${row.addedBy || ""}`,
    },
    {
      field: "assignedTo",
      headerName: "assignedTo",
      sortable: true,
      width: 160,
      valueGetter: (value, row) => `${row.assignedTo || ""}`,
    },
  ];

  return (
    <div className="h-[540px] w-full px-4 pb-8 xl:px-6">
      <div className="pb-5">
        <DataGrid
          rows={projectResponse?.data?.tasks || []}
          className="bg-white shadow-sm"
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </div>
    </div>
  );
}

export default TableView;
