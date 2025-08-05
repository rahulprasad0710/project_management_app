import {
  DndProvider,
  DragLayerMonitor,
  DropTargetMonitor,
  useDrag,
  useDrop,
} from "react-dnd";
import { EllipsisVertical, TicketCheck } from "lucide-react";
import { ResponseWithPagination, TaskStatus } from "@/types/user.types";
import { setIsTaskDetailsModalOpen, setTaskDetailsData } from "@/store";

import { HTML5Backend } from "react-dnd-html5-backend";
import { ITask } from "@/types/user.types";
import PriorityTag from "./molecules/PriorityTag";
import UserAvatar from "./molecules/UserAvatar";
import { setRefetchProjectTaskList } from "@/store";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/store/StoreProvider";
import { useUpdateTaskStatusMutation } from "@/store/api";

// import { format } from "date-fns";

type IProps = {
  isTaskModalOpen: boolean;
  setIsTaskModalOpen: (isOpen: boolean) => void;
  projectTasks: ResponseWithPagination<ITask[]> | undefined;
};

const taskStatus: TaskStatus[] = [
  "TODO",
  "IN_PROGRESS",
  "COMPLETED",
  "FOR_FIX",
  "UNDER_REVIEW",
];

const BoardView = (props: IProps) => {
  const dispatch = useAppDispatch();
  const { projectTasks, setIsTaskModalOpen, isTaskModalOpen } = props;
  const [updateTaskStatus] = useUpdateTaskStatusMutation();
  const tasksList = projectTasks?.data?.result || [];

  const handleUpdateTaskStatus = async (taskId: number, status: TaskStatus) => {
    try {
      const response = await updateTaskStatus({
        id: taskId,
        status,
      });
      if (response?.data?.success) {
        dispatch(setRefetchProjectTaskList(true));
      }
    } catch (error) {
      toast.error("Something Went Wrong");
    }
  };

  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-5">
          {taskStatus.map((status: TaskStatus) => {
            return (
              <TaskColumn
                setIsTaskModalOpen={setIsTaskModalOpen}
                isTaskModalOpen={isTaskModalOpen}
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
  isTaskModalOpen: boolean;
  setIsTaskModalOpen: (isOpen: boolean) => void;
  moveTask: (taskId: number, status: TaskStatus) => void;
};

const TaskColumn = (props: TaskColumnProps) => {
  const { status, tasks, moveTask, setIsTaskModalOpen, isTaskModalOpen } =
    props;

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
      className={`sl:py-4 rounded-lg bg-blue-100 py-2 shadow-sm xl:px-2 ${isOver ? "bg-blue-100" : ""} `}
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
      <div className="no-scrollbar h-[600px] overflow-y-scroll">
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
  const dispatch = useAppDispatch();
  const { task } = props;
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor: DragLayerMonitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleOpenTaskDetails = (data: ITask) => {
    dispatch(setTaskDetailsData(data));
    dispatch(setIsTaskDetailsModalOpen(true));
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
    </div>
  );
};

export default BoardView;
