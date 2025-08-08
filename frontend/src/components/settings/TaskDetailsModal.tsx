import { setIsTaskDetailsModalOpen, setTaskDetailsData } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/reduxHook";

import { Modal } from "@components/common/Modal";
import TaskDetails from "./TaskDetails";

const TaskDetailsModal = () => {
    const isTaskDetailsModalOpen = useAppSelector(
        (state) => state.global.isTaskDetailsModalOpen
    );

    const dispatch = useAppDispatch();

    const taskDetailsData = useAppSelector(
        (state) => state.global.taskDetailsData
    );

    const handleToggleModal = () => {
        dispatch(setIsTaskDetailsModalOpen(!isTaskDetailsModalOpen));
        dispatch(setTaskDetailsData(undefined));
    };
    return (
        <Modal
            className='max-w-3/5   '
            isFullscreen={false}
            isOpen={isTaskDetailsModalOpen}
            onClose={handleToggleModal}
            // showCloseButton={true}
        >
            <TaskDetails
                setSelectedData={setTaskDetailsData}
                selectedData={taskDetailsData}
            />
        </Modal>
    );
};

export default TaskDetailsModal;
