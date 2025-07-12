import { setIsTaskDetailsModalOpen, setTaskDetailsData } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/StoreProvider";

import { Edit } from "lucide-react";
import Modal from "../Modal";
import React from "react";
import TaskDetails from "../TaskDetails";

const TaskDetailModal = () => {
  const dispatch = useAppDispatch();

  const taskDetailsData = useAppSelector(
    (state) => state.global.taskDetailsData,
  );

  const isTaskDetailsModalOpen = useAppSelector(
    (state) => state.global.isTaskDetailsModalOpen,
  );

  return (
    <Modal
      isOpen={isTaskDetailsModalOpen}
      onClose={() => dispatch(setIsTaskDetailsModalOpen(false))}
      modalTitleChildren={
        <div className="flex items-center gap-4">
          <h2 className="ml-2 text-xl font-semibold text-gray-800">
            {taskDetailsData?.taskNumber}
          </h2>
          <button
            type="button"
            className="flex h-6 w-6 items-center justify-center rounded bg-gray-100"
          >
            <Edit className="h-4 w-4 text-blue-500 hover:text-blue-600" />
          </button>
        </div>
      }
    >
      <TaskDetails
        setSelectedData={setTaskDetailsData}
        selectedData={taskDetailsData}
      />
    </Modal>
  );
};

export default TaskDetailModal;
