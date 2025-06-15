"use client";

import React, { useState } from "react";

import BoardView from "@/app/(components)/BoardView";
import Header from "@/app/(components)/Header";
import Modal from "@/app/(components)/Modal";
import ProjectHeader from "@/app/(components)/ProjectHeader";
import SearchBar from "@/app/(components)/molecules/SearchBar";
import { SquarePlus } from "lucide-react";
import TableView from "@/app/(components)/TableView";
import TaskModal from "@/app/(components)/modals/TaskModal";
import TimelineView from "@/app/(components)/TimelineView";
import { useGetProjectByIdQuery } from "@/store/api";
import { useParams } from "next/navigation";

type BOARD_TYPES = "BOARD" | "LIST" | "CALENDAR" | "TIMELINE" | "TABLE";

const ProjectDetails = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<BOARD_TYPES>("BOARD");
  const [keyword, setKeyword] = useState<string>("");

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
      <div className="flex items-center justify-between pb-4 pt-4 lg:pb-4">
        <Header title="Project" />

        <div className="flex justify-end gap-4">
          <div className="flex items-center gap-2 md:gap-4">
            <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab} />
            <SearchBar setKeyword={setKeyword} keyword={keyword} />
          </div>

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
