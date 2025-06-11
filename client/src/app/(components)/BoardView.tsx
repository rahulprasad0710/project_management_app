import {
  DndProvider,
  DragLayerMonitor,
  DropTargetMonitor,
  useDrag,
  useDrop,
} from "react-dnd";
import {
  EllipsisVertical,
  MessageSquare,
  Paperclip,
  TicketCheck,
  User,
} from "lucide-react";
import { IProject, ITask } from "@/types/user.types";
import React, { useState } from "react";
import {
  useLazyGetProjectByIdQuery,
  useUpdateTaskStatusMutation,
} from "@/store/api";

import { HTML5Backend } from "react-dnd-html5-backend";
import Modal from "./Modal";
import PriorityTag from "./molecules/PriorityTag";
import { Response } from "@/store/api";
import TaskDetails from "./TaskDetails";
import { TaskStatus } from "@/types/user.types";
import UserAvatar from "./molecules/UserAvatar";

// import { format } from "date-fns";

type IProps = {
  projectResponse: Response<IProject> | undefined;
};

const taskStatus: TaskStatus[] = [
  "TODO",
  "IN_PROGRESS",
  "COMPLETED",
  "FOR_FIX",
  "UNDER_REVIEW",
];

const BoardView = (props: IProps) => {
  const { projectResponse } = props;
  const [fetchProject] = useLazyGetProjectByIdQuery();
  const [updateTaskStatus] = useUpdateTaskStatusMutation();
  const tasksList = projectResponse?.data?.tasks || [];

  const handleUpdateTaskStatus = async (taskId: number, status: TaskStatus) => {
    const response = await updateTaskStatus({
      id: taskId,
      status,
    });

    if (response) {
      fetchProject({
        projectId: projectResponse?.data?.id || 0,
      });
    }
  };

  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-5">
          {taskStatus.map((status: TaskStatus) => {
            return (
              <TaskColumn
                key={status}
                status={status}
                tasks={tasksList}
                moveTask={handleUpdateTaskStatus}
              />
            );
          })}
        </div>
      </DndProvider>
    </div>
  );
};

type TaskColumnProps = {
  status: TaskStatus;
  tasks: ITask[];
  moveTask: (taskId: number, status: TaskStatus) => void;
};

const TaskColumn = (props: TaskColumnProps) => {
  const { status, tasks, moveTask } = props;

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (items: { id: number }) => moveTask(items.id, status),
    collect: (monitor: DropTargetMonitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const taskCounter = tasks.filter((task) => task.status === status).length;

  const taskStatusColor: Record<TaskStatus, string> = {
    TODO: "#2563EB",
    IN_PROGRESS: "#2a9d8f",
    FOR_FIX: "#e76f51",
    UNDER_REVIEW: "#e9c46a",
    COMPLETED: "#264653",
  };

  return (
    <div
      ref={(instance) => {
        drop(instance);
      }}
      className={`sl:py-4 h-[600px] rounded-lg bg-gray-100 py-2 shadow-sm xl:px-2 ${isOver ? "bg-blue-100" : ""} `}
    >
      <div
        className={`h-1 bg-[${taskStatusColor[status as TaskStatus]}] mx-2 rounded-lg`}
        style={{
          backgroundColor: taskStatusColor[status],
        }}
      ></div>
      <div className="flex w-full">
        <div className="flex w-full items-center justify-between rounded-e-lg px-2 py-4">
          <h3 className="text-md flex items-center font-semibold">
            {status}
            <span
              className="ml-2 inline-block rounded-full bg-gray-100 p-1 text-center text-sm"
              style={{
                height: "1.5rem",
                width: "1.5rem",
              }}
            >
              {taskCounter}
            </span>
          </h3>
          <button className="flex h-6 w-5 items-center justify-center rounded bg-gray-200">
            <EllipsisVertical />
          </button>
        </div>
      </div>
      <div>
        {tasks
          .filter((task) => task.status === status)
          .map((task: ITask) => {
            return <TaskItem key={task.id} task={task} />;
          })}
      </div>
    </div>
  );
};

type TaskItemProps = {
  task: ITask;
};

const TaskItem = (props: TaskItemProps) => {
  const { task } = props;

  const [toggle, setToggle] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<undefined | ITask>();

  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor: DragLayerMonitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleOpenTaskDetails = (data: ITask) => {
    setSelectedData(data);
    setToggle(true);
  };

  return (
    <div
      ref={(instance) => {
        dragRef(instance);
      }}
    >
      <div
        className={`mx-2 mb-4 cursor-pointer rounded-sm bg-white shadow ${isDragging ? "opacity-50 shadow-sm shadow-green-300" : "opacity-100"}`}
      >
        <div
          onClick={() => handleOpenTaskDetails(task)}
          className="w-full px-4 py-2"
        >
          <div className="flex items-center gap-2">
            <PriorityTag priority={task.priority} />
            <span className="text-md"> {task.title}</span>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TicketCheck className="text-blue-600" />
              <span className="text-sm text-gray-500">{task.taskNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              {/* <Paperclip className="h-4 w-4 text-gray-500" />
              <MessageSquare className="h-4 w-4 text-gray-500" /> */}
              <UserAvatar user={task.assignedTo} />
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={toggle}
        onClose={() => setToggle(false)}
        modalTitleChildren={
          <div className="flex items-center gap-4">
            <TicketCheck className="text-blue-600" />

            <h2 className="text-xl font-semibold text-gray-800">
              {task.taskNumber}
            </h2>
          </div>
        }
      >
        <TaskDetails />
      </Modal>
    </div>
  );
};

export default BoardView;
