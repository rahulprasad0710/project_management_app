import {
  IStatusOptions,
  ITask,
  TaskStatus,
  statusOptions,
} from "@/types/user.types";
import React, { useEffect, useState } from "react";
import {
  useLazyGetTasksByTaskIdQuery,
  useUpdateTaskStatusMutation,
} from "@/store/api";

import ActivityBox from "./ActivityBox";
import PriorityTag from "./molecules/PriorityTag";
import TaskComments from "./TaskComments";
import { format } from "date-fns";
import { toast } from "react-toastify";

type Props = {
  selectedData: ITask | undefined;
  setSelectedData: (data: ITask | undefined) => void;
};

type TAB_TYPES = "ACTIVITY" | "COMMENTS";

const TaskDetails = ({ selectedData }: Props) => {
  const [activeTab, setActiveTab] = useState<TAB_TYPES>("COMMENTS");
  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  const [fetchTaskByTaskId, { data, isLoading, error }] =
    useLazyGetTasksByTaskIdQuery();

  useEffect(() => {
    if (selectedData?.id) {
      fetchTaskByTaskId({ taskId: selectedData.id });
    }
  }, [selectedData]);

  const handleUpdateTaskStatus = async (status: TaskStatus) => {
    const response = await updateTaskStatus({
      id: selectedData?.id,
      status,
    });

    if (response?.data?.id) {
      toast.success("Task status updated successfully");
    }
  };

  if (isLoading) return <div>Loading...</div>;

  if (data?.data === undefined || error) return <div>Task not found </div>;

  return (
    <div className="flex max-h-[600px] flex-col gap-4 overflow-y-scroll px-4 md:flex-row">
      <div className="flex-1 space-y-4">
        <h1 className="text-xl font-semibold">
          {data?.data?.id} -{data?.data?.title}
        </h1>

        <div className="mt-4">
          <h2 className="text-lg font-medium">Description</h2>
          <div
            className="border p-4"
            dangerouslySetInnerHTML={{
              __html: data?.data?.description as string,
            }}
          />
        </div>

        <div className="mt-6">
          <div className="mt-2 flex gap-2 rounded-md border border-gray-200 p-1">
            <button
              onClick={() => setActiveTab("ACTIVITY")}
              className={
                activeTab === "ACTIVITY"
                  ? "rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-200"
                  : "rounded bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
              }
            >
              Activities
            </button>
            <button
              onClick={() => setActiveTab("COMMENTS")}
              className={
                activeTab === "COMMENTS"
                  ? "rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-200"
                  : "rounded bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
              }
            >
              Comments
            </button>
          </div>
          <div className="mt-2">
            {" "}
            {activeTab === "ACTIVITY" && <ActivityBox />}
            {activeTab === "COMMENTS" && (
              <TaskComments taskId={data?.data?.id} />
            )}
          </div>
        </div>
      </div>
      <div className="w-full space-y-4 md:w-80">
        <div className="flex items-center gap-4">
          <div className="font-medium">Status:</div>

          <div className="relative w-full">
            <select
              onChange={(e) =>
                handleUpdateTaskStatus(e.target.value as TaskStatus)
              }
              value={data?.data?.status}
              className="block w-full appearance-none rounded border border-gray-200 bg-white px-4 py-2 pr-8 font-semibold leading-tight text-gray-700 focus:border-blue-300 focus:bg-white focus:outline-none"
            >
              {statusOptions.map((status: IStatusOptions) => (
                <option value={status.value} key={status.value}>
                  {status.label}
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
        </div>

        <div className="rounded-sm border bg-white p-4 shadow-sm">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="font-semibold">Assignee:</div>
              <div className="flex items-center gap-2">
                {data?.data?.assignedTo?.firstName}{" "}
                {data?.data?.assignedTo?.lastName}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="font-semibold">Reporter:</div>
              {data?.data?.assignedTo?.firstName}{" "}
              {data?.data?.assignedTo?.lastName}
            </div>
            <div className="my-1 border-t border-gray-200"></div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Priority:</span>
              <PriorityTag
                withLabel={true}
                priority={data?.data?.priority ?? "MEDIUM"}
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="font-semibold">Label:</div>
              <div
                style={{
                  backgroundColor:
                    data?.data?.taskLabel?.colorCode ?? "#023047",
                }}
                className="rounded-sm border px-4 py-1 text-white"
              >
                {data?.data?.taskLabel?.name ?? "None"}
              </div>
            </div>

            <div className="my-2 border-t border-gray-200"></div>
            <div className="text-gray-500">
              Created :
              {format(
                data?.data?.addedDate ?? new Date(),
                "dd-MM-yyyy hh:mm a",
              )}
            </div>
            <div className="text-gray-500">
              Updated :
              {format(
                data?.data?.addedDate ?? new Date(),
                "dd-MM-yyyy hh:mm a",
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;

// {
//   "id": 38,
//   "title": "Quia iusto asperiore",
//   "taskNumber": "JT-0029",
//   "description": "<p>Dolor voluptates in .</p>",
//   "addedDate": "2025-06-15T08:34:57.014Z",
//   "status": "IN_PROGRESS",
//   "priority": "HIGH",
//   "taskUploads": []
// }
