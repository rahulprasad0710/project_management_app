import { DndProvider, useDrag, useDrop } from "react-dnd";
import type { DragLayerMonitor, DropTargetMonitor } from "react-dnd";
import {
    EllipsisVertical,
    MessageSquare,
    Paperclip,
    TicketCheck,
} from "lucide-react";
import type {
    FeatureInfo,
    ITaskStatusResponse,
    ResponseWithPagination,
} from "@/types/config.types";
import { setIsTaskDetailsModalOpen, setTaskDetailsData } from "@/store";

import { HTML5Backend } from "react-dnd-html5-backend";
import type { ITask } from "@/types/config.types";
import PriorityTag from "@molecules/PriorityTag";
import UserAvatar from "@molecules/UserAvatar";
import { setRefetchProjectTaskList } from "@/store";
import { toast } from "react-toastify";
import { useAppDispatch } from "@store/reduxHook";
import { useEffect } from "react";
import { useLazyGetTaskStatusByFeatureIdQuery } from "@/api/hooks/useTaskStatus";
import { useUpdateTaskStatusMutation } from "@/api/hooks/useTask";

type IProps = {
    isTaskModalOpen: boolean;
    setIsTaskModalOpen: (isOpen: boolean) => void;
    projectTasks: ResponseWithPagination<ITask[]> | undefined;
    selectedFeature: FeatureInfo;
};

const KanbanTask = (props: IProps) => {
    const dispatch = useAppDispatch();
    const {
        projectTasks,
        setIsTaskModalOpen,
        isTaskModalOpen,
        selectedFeature,
    } = props;
    const [updateTaskStatus] = useUpdateTaskStatusMutation();
    const tasksList = projectTasks?.data?.result || [];

    const [
        fetchTaskStatus,
        { data: taskStatusList, isFetching: isTaskStatusFetching },
    ] = useLazyGetTaskStatusByFeatureIdQuery({});

    useEffect(() => {
        if (selectedFeature) {
            fetchTaskStatus({
                featureId: selectedFeature.features_id,
                isPaginationEnabled: false,
                page: 1,
                pageSize: 10,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedFeature]);

    const handleUpdateTaskStatus = async (taskId: number, status: number) => {
        try {
            const response = await updateTaskStatus({
                id: taskId,
                taskStatus: status,
            });
            if (response?.data?.success) {
                dispatch(setRefetchProjectTaskList(true));
            }
        } catch (_error: unknown) {
            toast.error("Something Went Wrong");
        }
    };

    return (
        <div>
            <DndProvider backend={HTML5Backend}>
                <div
                    className={`grid grid-cols-1 gap-4 mt-4 md:grid-cols-2 xl:grid-cols-4 ${
                        isTaskStatusFetching
                            ? "opacity-50 xl:grid-cols-4"
                            : `grid-cols-${taskStatusList?.data?.result?.length}`
                    }`}
                >
                    {taskStatusList?.data?.result?.map(
                        (status: ITaskStatusResponse) => {
                            return (
                                <TaskColumn
                                    setIsTaskModalOpen={setIsTaskModalOpen}
                                    isTaskModalOpen={isTaskModalOpen}
                                    key={status.id}
                                    status={status.name}
                                    taskStatusId={status.id}
                                    tasks={tasksList}
                                    moveTask={handleUpdateTaskStatus}
                                    statusColorCode={status.color_code}
                                />
                            );
                        }
                    )}
                </div>
            </DndProvider>
        </div>
    );
};

type TaskColumnProps = {
    status: string;
    taskStatusId: number;
    statusColorCode: string;
    tasks: ITask[];
    isTaskModalOpen: boolean;
    setIsTaskModalOpen: (isOpen: boolean) => void;
    moveTask: (taskId: number, status: number) => void;
};

const TaskColumn = (props: TaskColumnProps) => {
    const { status, tasks, moveTask, taskStatusId, statusColorCode } = props;

    const [{ isOver }, drop] = useDrop(() => ({
        accept: "task",
        drop: (items: { id: number }) => moveTask(items.id, taskStatusId),
        collect: (monitor: DropTargetMonitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    const taskCounter =
        tasks?.filter((task) => task?.task_status?.id === taskStatusId)
            .length || 0;

    return (
        <div
            ref={(instance) => {
                drop(instance);
            }}
            className={`sl:py-4 rounded-lg bg-gray-50 py-2 shadow-sm xl:px-2 ${
                isOver ? "bg-blue-100" : ""
            } `}
        >
            <div className='flex w-full mb-4'>
                <div
                    style={{
                        backgroundColor: statusColorCode,
                    }}
                    className='flex w-full items-center justify-between rounded-md px-2  '
                >
                    <div className='flex w-full items-center justify-between rounded-md  px-2 py-2 '>
                        <h3 className='text-md flex items-center font-semibold text-white'>
                            {status}
                        </h3>
                        <div
                            className='ml-2 flex items-center font-semibold text-white justify-center rounded-full bg-slate-800 p-1 text-center text-sm'
                            style={{
                                height: "1.5rem",
                                width: "1.5rem",
                            }}
                        >
                            {taskCounter}
                        </div>
                    </div>
                </div>
            </div>
            <div className='no-scrollbar h-[550px] overflow-y-scroll'>
                {tasks?.length
                    ? tasks
                          ?.filter(
                              (task) => task?.task_status?.id === taskStatusId
                          )
                          ?.map((task: ITask) => {
                              return <TaskItem key={task.id} task={task} />;
                          })
                    : []}
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
        console.log({
            data,
        });
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
                className={`mx-2 mb-4 cursor-pointer rounded-sm bg-white shadow ${
                    isDragging
                        ? "opacity-50 shadow-sm shadow-green-300"
                        : "opacity-100"
                }`}
            >
                <div
                    onClick={() => handleOpenTaskDetails(task)}
                    className='w-full px-4 py-2'
                >
                    <div className=' flex justify-between items-baseline '>
                        <div className='flex items-center gap-2'>
                            <PriorityTag priority={task.priority} />
                            <span className='text-md'> {task.title}</span>
                        </div>
                        <button className='flex h-6 w-5 items-center justify-center rounded bg-gray-200'>
                            <EllipsisVertical />
                        </button>
                    </div>
                    <div className=' my-2'>
                        <span
                            style={{
                                borderColor: task?.taskLabel?.colorCode,
                                borderWidth: "1px",
                            }}
                            className='text-slate-800 px-2'
                        >
                            {task?.taskLabel?.name ?? "None"}
                        </span>
                    </div>

                    <div className='mt-4 flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                            <TicketCheck className='text-blue-600' />
                            <span className='text-sm text-gray-500'>
                                {task.taskNumber}
                            </span>
                        </div>

                        <div className='flex items-center gap-4'>
                            {/* <Paperclip className='h-5 w-5 text-gray-500' />
                            <MessageSquare className='h-5 w-5 text-gray-500' /> */}
                            <UserAvatar size='sm' user={task.assignedTo} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KanbanTask;
