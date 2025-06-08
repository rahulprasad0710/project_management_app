"use client";

import {
  Clock,
  Filter,
  Grid3X3,
  Search,
  Share2,
  SquarePlus,
  Table,
} from "lucide-react";
import React, { useState } from "react";

import Header from "../(components)/Header";
import Modal from "../(components)/Modal";
import ProjectHeader from "../(components)/ProjectHeader";
import ProjectModal from "../(components)/ProjectModal";
import ProjectTable from "../(components)/ProjectTable";
import SearchBar from "../(components)/molecules/SearchBar";

type BOARD_TYPES = "BOARD" | "LIST" | "CALENDAR" | "TIMELINE" | "TABLE";

const ProjectPage = () => {
  const [activeTab, setActiveTab] = useState<BOARD_TYPES>("TABLE");
  const [isModalNewProjectOpen, setIsModalNewProjectOpen] =
    useState<boolean>(false);

  const handleToggleProjectModal = () => {
    setIsModalNewProjectOpen(!isModalNewProjectOpen);
  };
  const [keyword, setKeyword] = useState<string>("");

  return (
    <div className="container mx-auto px-4 lg:px-8 lg:pt-2 xl:max-w-7xl">
      <div className="my-4 flex justify-between">
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
            <span>Add new project</span>
          </button>
        </div>
      </div>

      <ProjectTable keyword={keyword} />

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
