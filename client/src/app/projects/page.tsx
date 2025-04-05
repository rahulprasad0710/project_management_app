"use client";

import React, { useState } from "react";
import ProjectHeader from "../(components)/ProjectHeader";
import ProjectCard from "../(components)/ProjectCard";
import BoardView from "../(components)/BoardView";
import TableView from "../(components)/TableView";
import { useParams } from "next/navigation";
import Header from "../(components)/Header";
import { SquarePlus } from "lucide-react";
import Modal from "../(components)/Modal";
import ProjectModal from "../(components)/ProjectModal";

type BOARD_TYPES = "BOARD" | "LIST" | "CALENDAR" | "TIMELINE";

const ProjectPage = () => {
  const [activeTab, setActiveTab] = useState<BOARD_TYPES>("BOARD");
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
