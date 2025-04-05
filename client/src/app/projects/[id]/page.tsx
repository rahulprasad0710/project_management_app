"use client";
import ProjectHeader from "@/app/(components)/ProjectHeader";
import TableView from "@/app/(components)/TableView";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useGetProjectByIdQuery } from "@/store/api";

type BOARD_TYPES = "BOARD" | "LIST" | "CALENDAR" | "TIMELINE" | "TABLE";
import Modal from "@/app/(components)/Modal";
import BoardView from "@/app/(components)/BoardView";
import TimelineView from "@/app/(components)/TimelineView";
import Header from "@/app/(components)/Header";
import { SquarePlus } from "lucide-react";
import TaskModal from "@/app/(components)/TaskModal";

const ProjectDetails = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<BOARD_TYPES>("BOARD");
  const {
    isFetching,
    data: projectResponse,
    error,
    isLoading,
  } = useGetProjectByIdQuery({
    projectId: Number(id),
  });

  console.log({
    projectResponse,
  });

  const [isModalNewProjectOpen, setIsModalNewProjectOpen] =
    useState<boolean>(false);

  const handleToggleProjectModal = () => {
    setIsModalNewProjectOpen(!isModalNewProjectOpen);
  };

  if (isLoading)
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  return (
    <div className="px-4 xl:px-6">
      <div className="pb-4 pt-4 lg:pb-4">
        <Header
          title="Project"
          showBtn={true}
          buttonComponent={
            <div>
              <button
                onClick={handleToggleProjectModal}
                className="flex items-center rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
              >
                <span>
                  <SquarePlus className="mr-3 h-5 w-5" />
                </span>
                <span>Add new task</span>
              </button>
            </div>
          }
        />
      </div>
      <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "TABLE" && <TableView projectResponse={projectResponse} />}

      {activeTab === "BOARD" && <BoardView projectResponse={projectResponse} />}

      {activeTab === "TIMELINE" && (
        <TimelineView projectResponse={projectResponse} />
      )}

      <Modal
        modalTitle="Add new task"
        isOpen={isModalNewProjectOpen}
        onClose={() => setIsModalNewProjectOpen(false)}
      >
        <TaskModal onClose={() => setIsModalNewProjectOpen(false)} />
      </Modal>
    </div>
  );
};

export default ProjectDetails;
