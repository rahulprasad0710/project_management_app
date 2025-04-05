import React, { Dispatch, SetStateAction, useState } from "react";
import Header from "../(components)/Header";
import DarkSemiRoundedButtonWithIcon from "./ButtonWithIcon";
import {
  Clock,
  Filter,
  Grid3X3,
  List,
  Share,
  Share2,
  Table,
} from "lucide-react";
import Modal from "./Modal";

type BOARD_TYPES = "BOARD" | "LIST" | "CALENDAR" | "TIMELINE" | "TABLE";

type IProps = {
  activeTab: BOARD_TYPES;
  setActiveTab: Dispatch<SetStateAction<BOARD_TYPES>>;
};

type TabButtonProps = {
  tabTittle: BOARD_TYPES;
  activeTab: BOARD_TYPES;
  icon: React.ReactNode;
  setActiveTab: (tabName: BOARD_TYPES) => void;
};

const TabButton = ({
  tabTittle,
  activeTab,
  icon,
  setActiveTab,
}: TabButtonProps) => {
  const isActive = activeTab === tabTittle;

  const handleClick = (tittle: BOARD_TYPES) => {
    setActiveTab(tittle);
  };

  return (
    <button
      onClick={() => handleClick(tabTittle)}
      className={`lg-px-4 relative flex items-center gap-2 px-1 py-2 text-gray-500 after:absolute after:-bottom-[5px] after:left-0 after:h-[2px] after:w-full hover:text-blue-600 sm:px-2 ${isActive ? "text-blue-600 after:bg-blue-600" : ""}`}
    >
      {icon}
      {tabTittle}
    </button>
  );
};

const ProjectHeader = ({ activeTab, setActiveTab }: IProps) => {
  return (
    <div className="mb-5 flex flex-wrap-reverse gap-2 border-y border-gray-200 pb-1 pt-2">
      <div className="flex flex-1 items-center gap-2 md:gap-4">
        <TabButton
          tabTittle="BOARD"
          activeTab={activeTab}
          icon={<Grid3X3 className="h-5 w-5" />}
          setActiveTab={setActiveTab}
        />
        <TabButton
          tabTittle="LIST"
          activeTab={activeTab}
          icon={<List className="h-5 w-5" />}
          setActiveTab={setActiveTab}
        />
        <TabButton
          tabTittle="TIMELINE"
          activeTab={activeTab}
          icon={<Clock className="h-5 w-5" />}
          setActiveTab={setActiveTab}
        />
        <TabButton
          tabTittle="TABLE"
          activeTab={activeTab}
          icon={<Table className="h-5 w-5" />}
          setActiveTab={setActiveTab}
        />
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <button className="text-gray-500 hover:text-gray-600">
          <Filter className="h-5 w-5" />
        </button>
        <button className="text-gray-500 hover:text-gray-600">
          <Share2 className="h-5 w-5" />
        </button>
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="rounded-sm border py-1 pl-10 pr-4 focus:border-gray-600 focus:outline-none focus:ring-gray-600"
          />

          <Grid3X3 className="absolute left-3 top-2 h-4 w-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;
