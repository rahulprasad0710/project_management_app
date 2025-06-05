"use client";

import React, { useState } from "react";

import BoardView from "../(components)/BoardView";
import Header from "../(components)/Header";
import Modal from "../(components)/Modal";
import ProjectCard from "../(components)/ProjectCard";
import ProjectHeader from "../(components)/ProjectHeader";
import ProjectModal from "../(components)/ProjectModal";
import ProjectTableView from "../(components)/ProjectTableView";
import { SquarePlus } from "lucide-react";
import TableView from "../(components)/TableView";
import { useGetProjectsQuery } from "@/store/api";
import { useParams } from "next/navigation";

type BOARD_TYPES = "BOARD" | "LIST" | "CALENDAR" | "TIMELINE" | "TABLE";

const ProjectPage = () => {
  const {
    isFetching,
    data: projectListResponse,
    error,
    isLoading,
  } = useGetProjectsQuery();

  console.log({
    projectListResponse,
  });

  const [activeTab, setActiveTab] = useState<BOARD_TYPES>("TABLE");
  const [isModalNewProjectOpen, setIsModalNewProjectOpen] =
    useState<boolean>(false);

  const handleToggleProjectModal = () => {
    setIsModalNewProjectOpen(!isModalNewProjectOpen);
  };
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
                <span>Add new project</span>
              </button>
            </div>
          }
        />
      </div>
      <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "TABLE" && (
        <ProjectTableView projectListResponse={projectListResponse} />
      )}

      <Modal
        modalTitle="Add new project"
        isOpen={isModalNewProjectOpen}
        onClose={() => setIsModalNewProjectOpen(false)}
      >
        <ProjectModal onClose={() => setIsModalNewProjectOpen(false)} />
      </Modal>
    </div>
  );
};

export default ProjectPage;
